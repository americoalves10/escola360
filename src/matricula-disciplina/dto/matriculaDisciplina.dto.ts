import { IsNumber } from 'class-validator';

export class DisciplinaMatricula {
  @IsNumber()
  matriculaId: number;

  @IsNumber()
  turmaProfessorDisciplinaId: number;
}
