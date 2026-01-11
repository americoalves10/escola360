import { Controller, Post, Body, Get, Param, Patch, Delete, ForbiddenException, Headers, } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Controller('material-didatico')
export class MaterialDidaticoController {
  constructor(private readonly service: MaterialDidaticoService) { }

  // PROFESSOR CRIA MATERIAL
  @Post('professor')
  createByProfessor(
    @Body() dto: CreateMaterialDidaticoDto,
    @Headers('professor-id') professorId: number,
  ) {
    if (!professorId) {
      throw new ForbiddenException('Professor não identificado');
    }
    return this.service.create(dto, Number(professorId));
  }

  @Get('professor/turma/:turmaId/disciplina/:disciplinaId')
  findForProfessor(
    @Param('turmaId') turmaId: number,
    @Param('disciplinaId') disciplinaId: number,
    @Headers('professor-id') professorId: number,
  ) {
    if (!professorId) {
      throw new ForbiddenException('Professor não identificado');
    }
    return this.service.findByProfessor(
      Number(turmaId),
      Number(disciplinaId),
    );
  }

  // ALUNO CONSULTA MATERIAL
  @Get('aluno/turma/:turmaId/disciplina/:disciplinaId')
  findForAluno(
    @Param('turmaId') turmaId: number,
    @Param('disciplinaId') disciplinaId: number,
    @Headers('alunoId') alunoId: number,
  ) {
    if (!alunoId) {
      throw new ForbiddenException('Aluno não identificado');
    }

    {
      return this.service.findVisiveisParaAluno(
        Number(alunoId),
        Number(turmaId),
        Number(disciplinaId),

      );
    }
  }

    // PROFESSOR ATUALIZA
    @Patch(':id')
    update(
      @Param('id') id: number,
      @Body() dto: UpdateMaterialDidaticoDto,
      @Headers('professor-id') professorId: number,
    ) {
      if (!professorId) {
        throw new ForbiddenException();
      }

      return this.service.update(Number(id), dto);
    }

    // TOGGLE VISIBILIDADE
    @Patch(':id/visibilidade')
    toggle(@Param('id') id: number) {
      return this.service.toggleVisibilidade(Number(id));
    }

    // REMOVE
    @Delete(':id')
    remove(
      @Param('id') id: number,
      @Headers('professor-id') professorId: number,
    ) {
      if (!professorId) {
        throw new ForbiddenException();
      }
      return this.service.remove(Number(id));
    }
  }
