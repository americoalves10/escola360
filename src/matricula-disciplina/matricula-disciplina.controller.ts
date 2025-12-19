import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatriculaDisciplinaService } from './matricula-disciplina.service';
import { DisciplinaMatricula } from './dto/matriculaDisciplina.dto';

@Controller('matricula-disciplina')
export class MatriculaDisciplinaController {
  constructor(private service: MatriculaDisciplinaService) {}

  @Post()
  adicionar(@Body() dto: DisciplinaMatricula) {
    return this.service.adicionar(dto);
  }

  @Get()
    listar() {
      return this.service.listar();
    }

}