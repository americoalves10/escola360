import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Avaliacao } from "./entityes/avaliacao.entity";
import { Repository } from "typeorm";
import { CreateAvaliacaoDto } from "./dtos/cria-avaliacao.dto";

@Injectable()
export class AvaliacaoService {
  constructor(
    @InjectRepository(Avaliacao)
    private repo: Repository<Avaliacao>,
  ) { }

  create(dto: CreateAvaliacaoDto) {
    return this.repo.save({
      ...dto,
      turmaProfessorDisciplina: { id: dto.turmaProfessorDisciplinaId },
    });
  }

  findAll() {
    return this.repo.find({ relations: ['questoes'] });
  }
}