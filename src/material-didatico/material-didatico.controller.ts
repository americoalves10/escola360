import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ForbiddenException,
  Headers,
} from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Controller('material-didatico')
export class MaterialDidaticoController {
  constructor(private readonly service: MaterialDidaticoService) {}

  @Post()
  create(
    @Body() dto: CreateMaterialDidaticoDto,
    @Headers('tipo') tipo: string,
  ) {
    if (tipo !== 'PROFESSOR') {
      throw new ForbiddenException(
        'Apenas professores podem adicionar material',
      );
    }

    return this.service.create(dto);
  }

  @Get('disciplina/:disciplinaId/turma/:turmaId')
  findAll(
    @Param('disciplinaId') disciplinaId: number,
    @Param('turmaId') turmaId: number,
  ) {
    return this.service.findByDisciplinaETurma(disciplinaId, turmaId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateMaterialDidaticoDto,
    @Headers('tipo') tipo: string,
  ) {
    if (tipo !== 'PROFESSOR') {
      throw new ForbiddenException();
    }

    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Headers('tipo') tipo: string,
  ) {
    if (tipo !== 'PROFESSOR') {
      throw new ForbiddenException();
    }

    return this.service.remove(id);
  }
}