import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissaoAvaliacao } from './entity/submissao-avaliacao.entity';
import { SubmissaoAvaliacaoService } from './submissao.service';
import { SubmissaoAvaliacaoController } from './submissao.controller';
import { Avaliacao } from 'src/avaliacao/entity/avaliacao.entity';
import { Matricula } from 'src/matricula/entity/matricula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubmissaoAvaliacao,
      Avaliacao,
      Matricula,
    ]),
  ],
  controllers: [SubmissaoAvaliacaoController],
  providers: [SubmissaoAvaliacaoService],
})
export class SubmissaoAvaliacaoModule {}
