import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoService } from './historico.service';
import { HistoricoController } from './historico.controller';
import { SubmissaoAvaliacao } from 'src/avaliacao-submissao/entity/submissao-avaliacao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissaoAvaliacao]),
  ],
  controllers: [HistoricoController],
  providers: [HistoricoService],
})
export class HistoricoModule {}