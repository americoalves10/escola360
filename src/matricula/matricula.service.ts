import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Matricula } from "./entity/matricula.entity";
import { Repository } from "typeorm";
import { User } from "src/aluno/entity/aluno.entity";
import { TurmaProfessorDisciplina } from "src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity";
import { MatriculaDto } from "./dto/matricula.dto";

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private repo: Repository<Matricula>,

    @InjectRepository(User)
    private alunoRepo: Repository<User>,

    @InjectRepository(TurmaProfessorDisciplina)
    private tpdRepo: Repository<TurmaProfessorDisciplina>,
  ) {}

async matricular(dto: MatriculaDto) {

  const aluno = await this.alunoRepo.findOneBy({ id: dto.alunoId });
  const oferta = await this.tpdRepo.findOneBy({ id: dto.professorTurmaDisciplinaId });

  if (!aluno || !oferta) {
    throw new NotFoundException('Aluno ou oferta não encontrada');
  }

  // REGRA DEFINITIVA: aluno só pode ter UMA matrícula
  const jaMatriculado = await this.repo
    .createQueryBuilder('m')
    .where('m.aluno_id = :alunoId', { alunoId: aluno.id })
    .getOne();

  if (jaMatriculado) {
    throw new BadRequestException(
      'O aluno já está matriculado em uma turma'
    );
  }

  const matricula = this.repo.create({
    aluno,
    turmaProfessorDisciplina: oferta,
  });

  return this.repo.save(matricula);
}

  listar() {
    return this.repo.find({
      relations: [
        'aluno',
        'turmaProfessorDisciplina',
        'turmaProfessorDisciplina.professor',
        'turmaProfessorDisciplina.turma',
        'turmaProfessorDisciplina.disciplina',
      ],
    });
  }
}