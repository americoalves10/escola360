import { IsNotEmpty } from 'class-validator';
import { Unique } from 'typeorm';

export class MatriculaDto {
  @IsNotEmpty()
  alunoId: number;

  @IsNotEmpty()
  professorTurmaDisciplinaId: number;
}