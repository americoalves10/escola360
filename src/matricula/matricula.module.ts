import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entity/matricula.entity';
import { User } from 'src/aluno/entity/aluno.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Matricula,
      User,
      Turma,
      TurmaProfessorDisciplina,
    ]),
  ],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}