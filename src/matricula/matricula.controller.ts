import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaDto } from './dto/matricula.dto';

@Controller('matricula')
export class MatriculaController {
  constructor(private service: MatriculaService) {}

  @Post()
  criar(@Body() dto: MatriculaDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
}