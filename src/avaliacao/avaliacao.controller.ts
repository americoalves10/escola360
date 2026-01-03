import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service";
import { CreateAvaliacaoDto } from "./dtos/cria-avaliacao.dto";


@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private service: AvaliacaoService) { }

  @Post()
  create(@Body() dto: CreateAvaliacaoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}


