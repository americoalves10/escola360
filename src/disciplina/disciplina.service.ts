import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Disciplina } from './entity/disciplina.entity';
import { DisciplinaDto } from './dto/disciplina.dto';
import { Turma } from 'src/turma/entity/turma.entity';
import { Professor } from 'src/professor/entity/professor.entity';

@Injectable()
export class DisciplinaService {

  constructor(
    @InjectRepository(Disciplina)
    private readonly disciplinaRepository: Repository<Disciplina>,

    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,

    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  
  async create(dto: DisciplinaDto): Promise<Disciplina> {

    const turma = await this.turmaRepository.findOne({
      where: { id: dto.id_turma },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada.');
    }

    const professor = await this.professorRepository.findOne({
      where: { id: dto.id_professor },
    });

    if (!professor) {
      throw new NotFoundException('Professor não encontrado.');
    }

    const disciplina = this.disciplinaRepository.create({
      nome: dto.nome,
      codDisciplina: dto.codDisciplina,
      status: dto.status,
      cargaHoraria: dto.cargaHoraria,
      assunto: dto.assunto,
      turma: turma,
      professor: professor,
    });

    try {
      return await this.disciplinaRepository.save(disciplina);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar a disciplina.',
      );
    }
  }

  
  findAll(): Promise<Disciplina[]> {
    return this.disciplinaRepository.find();
  }

  
  async findOne(id: number): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { id },
    });

    if (!disciplina) {
      throw new NotFoundException(
        `Disciplina com ID ${id} não encontrada.`,
      );
    }

    return disciplina;
  }

  
  async update(id: number, dto: DisciplinaDto): Promise<Disciplina> {
    const disciplina = await this.findOne(id);

    if (dto.id_turma) {
      const turma = await this.turmaRepository.findOne({
        where: { id: dto.id_turma },
      });
      if (!turma) {
        throw new NotFoundException('Turma não encontrada.');
      }
      disciplina.turma = turma;
    }

    if (dto.id_professor) {
      const professor = await this.professorRepository.findOne({
        where: { id: dto.id_professor },
      });
      if (!professor) {
        throw new NotFoundException('Professor não encontrado.');
      }
      disciplina.professor = professor;
    }

    disciplina.nome = dto.nome ?? disciplina.nome;
    disciplina.cargaHoraria = dto.cargaHoraria ?? disciplina.cargaHoraria;
    disciplina.codDisciplina = dto.codDisciplina ?? disciplina.codDisciplina;
    disciplina.status = dto.status ?? disciplina.status;
    disciplina.assunto = dto.assunto ?? disciplina.assunto;

    return this.disciplinaRepository.save(disciplina);
  }

  
  // async remove(id: number): Promise<void> {
  //   const result = await this.disciplinaRepository.delete(id);

  //   if (result.affected === 0) {
  //     throw new NotFoundException(
  //       `Disciplina com ID ${id} não encontrada.`,
  //     );
  //   }
  // }
}