import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './entity/avaliacao.entity';
import { AvaliacaoService } from './avaliacao.service';
import { AvaliacaoController } from './avaliacao.controller';
import { Turma } from 'src/turma/entity/turma.entity';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Professor } from 'src/professor/entity/professor.entity';
import { Aluno } from 'src/aluno/entity/aluno.entity';
import { Matricula } from 'src/matricula/entity/matricula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avaliacao,
      Turma,
      Disciplina,
      Professor,
      Aluno,
      Matricula,
    ]),
  ],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
  exports: [TypeOrmModule],
})
export class AvaliacaoModule {}
