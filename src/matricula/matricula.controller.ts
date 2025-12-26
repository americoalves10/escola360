import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaDto } from './dto/matricula.dto';

@Controller('matricula')
export class MatriculaController {
  constructor(private service: MatriculaService) {}

  //informações de todos alunos da turma
  @Get('turma/:turmaId/alunos-simples')
    findAlunos(@Param('turmaId') turmaId: string) {
        return this.service.findSomenteAlunosPorTurma(Number(turmaId));
  }

  @Post()
  criar(@Body() dto: MatriculaDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
  
}