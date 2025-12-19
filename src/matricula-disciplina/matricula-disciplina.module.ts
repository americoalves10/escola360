import { Module } from '@nestjs/common';
import { MatriculaDisciplinaService } from './matricula-disciplina.service';
import { MatriculaDisciplinaController } from './matricula-disciplina.controller';
import { MatriculaDisciplina } from './entity/matriculaDisciplina.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from 'src/matricula/entity/matricula.entity';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Matricula,
        MatriculaDisciplina,
        TurmaProfessorDisciplina,
      ]),
    ],
  controllers: [MatriculaDisciplinaController],
  providers: [MatriculaDisciplinaService],
})
export class MatriculaDisciplinaModule {}
