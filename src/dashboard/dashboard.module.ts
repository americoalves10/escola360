import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Avaliacao } from 'src/avaliacao/entity/avaliacao.entity';
import { SubmissaoAvaliacao } from 'src/avaliacao-submissao/entity/submissao-avaliacao.entity';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';
import { MatriculaDisciplina } from 'src/matricula-disciplina/entity/matriculaDisciplina.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avaliacao,
      SubmissaoAvaliacao,
      TurmaProfessorDisciplina,
      MatriculaDisciplina,
    ]), 
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}


