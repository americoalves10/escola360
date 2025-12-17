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

import { Professor } from './entity/professor.entity';
import { ProfessorDto } from './dto/professor.dto';
import { Turma } from 'src/turma/entity/turma.entity';

@Injectable()
export class ProfessorService {

  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,

    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,

    private readonly jwtService: JwtService,
  ) {}

  
  async create(dto: ProfessorDto): Promise<Professor> {

    // const emailExiste = await this.professorRepository.findOne({
    //   where: { email: dto.email },
    // });

    // if (emailExiste) {
    //   throw new ConflictException('Este e-mail já está em uso.');
    // }

    // Busca turma
    const turma = await this.turmaRepository.findOne({
      where: { id: dto.id_turma },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada.');
    }

    if (!dto.matricula) {
      throw new NotFoundException('Matricula não encontrada.');
    }

    const senhaHash = await bcrypt.hash(dto.password, 10);

    const professor = this.professorRepository.create({
      matricula: dto.matricula,
      nome: dto.nome,
      cpf: dto.cpf,
      dataAdmissao: dto.dataAdmissao,
      status: dto.status,
      turma: turma, // 🔥 relação
      formacaoAcad: dto.formacaoAcad, 
      titulacao: dto.titulacao,
      deficiencia: dto.deficiencia,
      tipoDeficiencia: dto.tipoDeficiencia,
      email: dto.email,
      password: senhaHash,
      
    });

    try {
      return await this.professorRepository.save(professor);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o professor.',
      );
    }
  }

  
  findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }

  
  async findOne(id: number): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id },
    });

    if (!professor) {
      throw new NotFoundException(
        `Professor com ID ${id} não encontrado.`,
      );
    }

    return professor;
  }

  
  async update(id: number, dto: ProfessorDto): Promise<Professor> {
    const professor = await this.findOne(id);

    if (dto.id_turma) {
      const turma = await this.turmaRepository.findOne({
        where: { id: dto.id_turma },
      });

      if (!turma) {
        throw new NotFoundException('Turma não encontrada.');
      }

      professor.turma = turma;
    }

    professor.nome = dto.nome ?? professor.nome;
    professor.cpf = dto.cpf ?? professor.cpf;
    professor.status = dto.status ?? professor.status;
    professor.email = dto.email ?? professor.email;

    if (dto.password) {
      professor.password = await bcrypt.hash(dto.password, 10);
    }

    return this.professorRepository.save(professor);
  }

  
  async remove(id: number): Promise<void> {
    const result = await this.professorRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Professor com ID ${id} não encontrado.`,
      );
    }
  }

  
  async login(dto: ProfessorDto): Promise<{ access_token: string }> {

    const professor = await this.professorRepository.findOne({
      where: { email: dto.email },
    });

    if (!professor) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const senhaConfere = await bcrypt.compare(
      dto.password,
      professor.password,
    );

    if (!senhaConfere) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: professor.id,
      email: professor.email,
      role: 'professor',
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}