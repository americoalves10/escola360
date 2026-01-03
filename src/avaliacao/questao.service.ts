import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Questao } from "./entityes/questao.entity";
import { Repository } from "typeorm";
import { CreateQuestaoDto } from "./dtos/cria-questao.dto";

@Injectable()
export class QuestaoService {
  constructor(
    @InjectRepository(Questao)
    private repo: Repository<Questao>,
  ) { }

  create(dto: CreateQuestaoDto) {
    return this.repo.save({
      enunciado: dto.enunciado,
      tipo: dto.tipo,
      valor: dto.valor,
      avaliacao: { id: dto.avaliacaoId },
    });
  }

  findByAvaliacao(avaliacaoId: number) {
    return this.repo.find({
      where: { avaliacao: { id: avaliacaoId } },
      relations: ['alternativas'],
    });
  }
}
