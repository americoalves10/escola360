import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';

import { DisciplinaService } from './disciplina.service';
import { DisciplinaDto } from './dto/disciplina.dto';

@Controller('disciplina')
export class DisciplinaController {

  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  create(@Body() dto: DisciplinaDto) {
    return this.disciplinaService.create(dto);
  }

  @Get()
  findAll() {
    return this.disciplinaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.disciplinaService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: DisciplinaDto) {
    return this.disciplinaService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.disciplinaService.remove(Number(id));
  }
}