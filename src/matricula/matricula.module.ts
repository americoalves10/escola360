import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entity/matricula.entity';
import { User } from 'src/aluno/entity/aluno.entity';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Matricula,
      User,
      TurmaProfessorDisciplina,
    ]),
  ],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}
