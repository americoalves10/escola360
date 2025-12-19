import { IsNotEmpty, IsNumber } from 'class-validator';

export class MatriculaDto {

  @IsNumber()
  alunoId: number;

  @IsNumber()
  turmaId: number;
}


