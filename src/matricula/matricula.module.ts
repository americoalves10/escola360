import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entity/matricula.entity';
import { Aluno } from 'src/aluno/entity/aluno.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Matricula,
      Aluno,
      Turma,
    ]),
  ],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule { }