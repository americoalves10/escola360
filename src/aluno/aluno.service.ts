import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Aluno } from './entity/aluno.entity';
import { UserDto } from './dto/aluno.dto';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private readonly userRepository: Repository<Aluno>,

    private readonly jwtService: JwtService,
  ) {}

  
  async create(dto: UserDto): Promise<Aluno> {
    const {
      matricula,
      nome,
      cpf,
      dataNasc,
      status,      
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

  findAll(): Promise<Aluno[]> {
    return this.userRepository.find(); // eager carrega a turma
  }
  
  async findOne(id: number): Promise<Aluno> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
    }
    return user;
  }

  
  async update(id: number, dto: UserDto): Promise<Aluno> {
    const user = await this.findOne(id);

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

  
  // async remove(id: number): Promise<void> {
  //   const result = await this.userRepository.delete(id);

  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Aluno com ID ${id} não encontrado.`);
  //   }
  // }

//    esse é o responsável por subistituir a senha hash cadastradas no banco por uma nova, tbm segue o mesmo princípio da outra para os outrs perfis;
  async changePassword(id: number, data: { senhaAtual: string; novaSenha: string }) {
        const user = await this.findOne(id);

        const senhaValida = await bcrypt.compare(data.senhaAtual, user.password);
            if (!senhaValida) {
                throw new UnauthorizedException('Senha atual inválida');
            }

        user.password = await bcrypt.hash(data.novaSenha, 10);
        return this.userRepository.save(user);
  }  
  
  async updateStatus(id: number, status: string): Promise<Aluno> {
    const user = await this.findOne(id);

    user.status = status;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar status do professor.',
      );
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

  // metodo que retorna as informações completas sobre um aluno específico
  async findAlunoCompleto(alunoId: number) {
  return this.userRepository.findOne({
    where: { id: alunoId },
    relations: [
      'matriculas',
      'matriculas.turma',
      'matriculas.disciplinas',
      'matriculas.disciplinas.turmaProfessorDisciplina',
      'matriculas.disciplinas.turmaProfessorDisciplina.professor',
      'matriculas.disciplinas.turmaProfessorDisciplina.disciplina',
    ],
  });
  }
  
}



