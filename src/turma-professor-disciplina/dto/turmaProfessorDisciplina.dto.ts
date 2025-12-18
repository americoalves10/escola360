import { IsNotEmpty } from 'class-validator';

export class CreateTurmaProfessorDisciplinaDto {
  @IsNotEmpty()
  professorId: number;

  @IsNotEmpty()
  turmaId: number;

  @IsNotEmpty()
  disciplinaId: number;
}