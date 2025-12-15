import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entity/aluno.entity';
import { UserDto } from './dto/aluno.dto';
import { Turma } from 'src/turma/entity/turma.entity';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,

    private readonly jwtService: JwtService,
  ) {}

  
  async create(dto: UserDto): Promise<User> {
    const {
      matricula,
      nome,
      cpf,
      dataNasc,
      status,
      id_turma,
      deficiencia,
      tipoDeficiencia,
      email,
      password,
    } = dto;

    // 1️⃣ Verifica se o e-mail já existe
    const emailExiste = await this.userRepository.findOne({
      where: { email },
    });

    if (emailExiste) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2️⃣ Busca a turma pelo ID recebido no DTO
    const turma = await this.turmaRepository.findOne({
      where: { id: id_turma },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada.');
    }

    // 3️⃣ Criptografa a senha
    const salt = await bcrypt.genSalt();
    const senhaCriptografada = await bcrypt.hash(password, salt);

    // 4️⃣ Cria o aluno associando a turma
    const user = this.userRepository.create({
      matricula,
      nome,
      cpf,
      dataNasc,
      status,
      deficiencia,
      tipoDeficiencia,
      email,
      password: senhaCriptografada,
      turma: turma, // 🔥 RELAÇÃO AQUI
    });

    // 5️⃣ Salva no banco
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o aluno no banco.',
      );
    }
  }

  
  findAll(): Promise<User[]> {
    return this.userRepository.find(); // eager carrega a turma
  }

  
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
    }

    return user;
  }

  
  async update(id: number, dto: UserDto): Promise<User> {
    const user = await this.findOne(id);

    // Se mudar a turma
    if (dto.id_turma) {
      const turma = await this.turmaRepository.findOne({
        where: { id: dto.id_turma },
      });

      if (!turma) {
        throw new NotFoundException('Turma não encontrada.');
      }

      user.turma = turma;
    }

    // Atualiza campos simples
    user.matricula = dto.matricula ?? user.matricula;
    user.nome = dto.nome ?? user.nome;
    user.cpf = dto.cpf ?? user.cpf;
    user.dataNasc = dto.dataNasc ?? user.dataNasc;
    user.status = dto.status ?? user.status;
    user.deficiencia = dto.deficiencia ?? user.deficiencia;
    user.tipoDeficiencia = dto.tipoDeficiencia ?? user.tipoDeficiencia;
    user.email = dto.email ?? user.email;

    // Se trocar senha
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.save(user);
  }

  
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
    }
  }

  
  async login(dto: UserDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const senhaConfere = await bcrypt.compare(password, user.password);

    if (!senhaConfere) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
