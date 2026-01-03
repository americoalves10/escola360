import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResultadoAvaliacao } from "./entityes/resultado-avaliacao.entity";
import { RespostaAluno } from "./entityes/resposta-aluno.entity";
import { Repository } from "typeorm";
import { Avaliacao } from "./entityes/avaliacao.entity";

@Injectable()
export class ResultadoAvaliacaoService {
  constructor(
    @InjectRepository(ResultadoAvaliacao)
    private repo: Repository<ResultadoAvaliacao>,

    @InjectRepository(RespostaAluno)
    private respostaRepo: Repository<RespostaAluno>,

    @InjectRepository(Avaliacao)
    private avaliacaoRepo: Repository<Avaliacao>,
  ) { }

  async finalizar(alunoId: number, avaliacaoId: number) {
    const avaliacao = await this.avaliacaoRepo.findOneBy({ id: avaliacaoId });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    const respostas = await this.respostaRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.questao', 'q')
      .leftJoin('r.aluno', 'a')
      .leftJoin('q.avaliacao', 'av')
      .where('a.id = :alunoId', { alunoId })
      .andWhere('av.id = :avaliacaoId', { avaliacaoId })
      .getMany();

    const notaFinal = respostas.reduce(
      (soma, r) => soma + Number(r.nota || 0),
      0,
    );

    const totalQuestoes = respostas.reduce(
      (soma, r) => soma + Number(r.questao?.valor || 0),
      0,
    );

    const percentual = totalQuestoes > 0
      ? (notaFinal / totalQuestoes) * 100
      : 0;

    let resultado = await this.repo.findOne({
      where: {
        aluno: { id: alunoId },
        avaliacao: { id: avaliacaoId },
      },
    });

    if (!resultado) {
      resultado = this.repo.create({
        aluno: { id: alunoId },
        avaliacao: { id: avaliacaoId },
      });
    }

    resultado.nota_final = notaFinal;
    resultado.percentual = percentual;
    resultado.finalizado = true;

    return this.repo.save(resultado);
  }
}
