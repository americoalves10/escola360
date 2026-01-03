import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlternativaController } from "./alternativa.controller";
import { AlternativaService } from "./alternativa.service";
import { AvaliacaoController } from "./avaliacao.controller";
import { AvaliacaoService } from "./avaliacao.service";
import { Alternativa } from "./entityes/alternativa.entity";
import { Avaliacao } from "./entityes/avaliacao.entity";
import { Questao } from "./entityes/questao.entity";
import { RespostaAluno } from "./entityes/resposta-aluno.entity";
import { ResultadoAvaliacao } from "./entityes/resultado-avaliacao.entity";
import { QuestaoController } from "./questao.controller";
import { QuestaoService } from "./questao.service";
import { RespostaAlunoController } from "./resposta-aluno.controller";
import { RespostaAlunoService } from "./resposta-aluno.service";
import { ResultadoAvaliacaoController } from "./resultado-avaliacao.controller";
import { ResultadoAvaliacaoService } from "./resultado-avaliacao.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avaliacao,
      Questao,
      Alternativa,
      RespostaAluno,
      ResultadoAvaliacao,
    ]),
  ],
  controllers: [
    AvaliacaoController,
    QuestaoController,
    AlternativaController,
    RespostaAlunoController,
    ResultadoAvaliacaoController,
  ],
  providers: [
    AvaliacaoService,
    QuestaoService,
    AlternativaService,
    RespostaAlunoService,
    ResultadoAvaliacaoService,
  ],
})
export class AvaliacaoModule { }
