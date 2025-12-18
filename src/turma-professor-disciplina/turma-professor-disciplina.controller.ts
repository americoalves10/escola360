import { Body, Controller, Get, Post } from "@nestjs/common";
import { TurmaProfessorDisciplinaService } from "./turma-professor-disciplina.service";
import { CreateTurmaProfessorDisciplinaDto } from "./dto/turmaProfessorDisciplina.dto";


@Controller('turma-professor-disciplina')
export class TurmaProfessorDisciplinaController {
  constructor(private service: TurmaProfessorDisciplinaService) {}

  @Post()
  vincular(@Body() dto: CreateTurmaProfessorDisciplinaDto) {
    return this.service.vincular(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
}