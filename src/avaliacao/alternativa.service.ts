import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Alternativa } from "./entityes/alternativa.entity";
import { Repository } from "typeorm";
import { CreateAlternativaDto } from "./dtos/cria-alternativa.dto";

@Injectable()
export class AlternativaService {
  constructor(
    @InjectRepository(Alternativa)
    private repo: Repository<Alternativa>,
  ) { }

  create(dto: CreateAlternativaDto) {
    return this.repo.save({
      descricao: dto.descricao,
      correta: dto.correta,
      questao: { id: dto.questaoId },
    });

  }
}
