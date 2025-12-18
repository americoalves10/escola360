import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Professor } from "src/professor/entity/professor.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { Disciplina } from "src/disciplina/entity/disciplina.entity";
import { TurmaProfessorDisciplina } from "./entity/turmaProfessorDisciplina.entity";
import { CreateTurmaProfessorDisciplinaDto } from "./dto/turmaProfessorDisciplina.dto";


@Injectable()
export class TurmaProfessorDisciplinaService {
  constructor(
    @InjectRepository(TurmaProfessorDisciplina)
    private ptRepo: Repository<TurmaProfessorDisciplina>,

    @InjectRepository(Professor)
    private professorRepo: Repository<Professor>,

    @InjectRepository(Turma)
    private turmaRepo: Repository<Turma>,

    @InjectRepository(Disciplina)
    private disciplinaRepo: Repository<Disciplina>,
  ) {}

  async vincular(dto: CreateTurmaProfessorDisciplinaDto) {
    const professor = await this.professorRepo.findOneBy({ id: dto.professorId });
    const turma = await this.turmaRepo.findOneBy({ id: dto.turmaId });
    const disciplina = await this.disciplinaRepo.findOneBy({ id: dto.disciplinaId });

    if (!professor || !turma || !disciplina) {
      throw new NotFoundException('Professor, turma ou disciplina não encontrados');
    }

    const vinculo = this.ptRepo.create({ professor, turma, disciplina });
    return this.ptRepo.save(vinculo);
  }

  listar() {
    return this.ptRepo.find({
      relations: ['professor', 'turma', 'disciplina'],
    });
  }
}