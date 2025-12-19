import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Matricula } from "./entity/matricula.entity";
import { Repository } from "typeorm";
import { User } from "src/aluno/entity/aluno.entity";
import { TurmaProfessorDisciplina } from "src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity";
import { MatriculaDto } from "./dto/matricula.dto";
import { Turma } from "src/turma/entity/turma.entity";

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private repo: Repository<Matricula>,

    @InjectRepository(User)
    private alunoRepo: Repository<User>,

    @InjectRepository(Turma)
    private turmaRepo: Repository<Turma>,

    @InjectRepository(TurmaProfessorDisciplina)
    private tpdRepo: Repository<TurmaProfessorDisciplina>,
  ) {}

async criar(dto: MatriculaDto) {

  const aluno = await this.alunoRepo.findOneBy({ id: dto.alunoId });
  const turma = await this.turmaRepo.findOneBy({ id: dto.turmaId });

  if (!aluno || !turma) {
    throw new NotFoundException('Aluno ou turma não encontrados');
  }

  const jaExiste = await this.repo.findOne({
    where: { aluno: { id: aluno.id }, turma: { id: turma.id } },
  });

  if (jaExiste) {
    throw new BadRequestException('Aluno já matriculado nesta turma');
  }

  const matricula = this.repo.create({ aluno, turma });
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