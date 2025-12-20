import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTurmaProfessorDisciplinaDto {
  @IsNotEmpty()
  @IsNumber()
  professorId: number;

  @IsNotEmpty()
  @IsNumber()
  turmaId: number;

  @IsNotEmpty()
  @IsNumber()
  disciplinaId: number;
}