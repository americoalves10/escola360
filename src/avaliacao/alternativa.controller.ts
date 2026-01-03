import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AlternativaService } from "./alternativa.service";
import { CreateAlternativaDto } from "./dtos/cria-alternativa.dto";


@Controller('alternativas')
export class AlternativaController {
  constructor(private service: AlternativaService) { }

  @Post()
  create(@Body() dto: CreateAlternativaDto) {
    return this.service.create(dto);
  }
}


