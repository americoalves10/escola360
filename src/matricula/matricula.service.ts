import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Matricula } from "./entity/matricula.entity";
import { Aluno } from "src/aluno/entity/aluno.entity"; // Importando a nova classe Aluno
import { Turma } from "src/turma/entity/turma.entity";
import { MatriculaDto } from "./dto/matricula.dto";

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private repo: Repository<Matricula>,

    @InjectRepository(Aluno) // Usando o repositório correto
    private alunoRepo: Repository<Aluno>,

    @InjectRepository(Turma)
    private turmaRepo: Repository<Turma>,
  ) {}

  async criar(dto: MatriculaDto) {

    const aluno = await this.alunoRepo.findOneBy({ id: Number(dto.alunoId) });
    const turma = await this.turmaRepo.findOneBy({ id: Number(dto.turmaId) });

    if (!aluno || !turma) {
      throw new NotFoundException('Aluno ou turma não encontrados');
    }

    const jaExiste = await this.repo.findOne({
        where: { 
          aluno: { id: aluno.id }, 
          turma: { id: turma.id },
          anoLetivo: dto.anoLetivo 
        }
    });

    if (jaExiste) {
         throw new BadRequestException('Este aluno já está matriculado nesta turma para este ano letivo.');
    }

    // Usando os IDs diretamente ou os objetos
    const matricula = this.repo.create({ 
         aluno, 
         turma, 
         anoLetivo: dto.anoLetivo 
    });

      return this.repo.save(matricula);
  }

  listar() {
      return this.repo.find({
        relations: ['aluno', 'turma'],
      });
  }

  // metodo que retorna as informações de todos alunos da turma
  async findSomenteAlunosPorTurma(turmaId: number) {
  const matriculas = await this.repo.find({
    where: { turma: { id: turmaId } },
    relations: ['aluno'],
  });

  return matriculas.map(m => m.aluno);
  }

}

