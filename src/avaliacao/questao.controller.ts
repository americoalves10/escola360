import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QuestaoService } from "./questao.service";
import { CreateQuestaoDto } from "./dtos/cria-questao.dto";


@Controller('questoes')
export class QuestaoController {
  constructor(private readonly service: QuestaoService) { }

  @Post()
  create(@Body() dto: CreateQuestaoDto) {
    return this.service.create(dto);
  }

  @Get('avaliacao/:id')
  find(@Param('id') id: number) {
    return this.service.findByAvaliacao(id);
  }
}