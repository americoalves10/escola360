import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MatriculaDto {
  @IsNotEmpty()
  @IsNumber()
  alunoId: number;

  @IsNotEmpty()
  @IsNumber()
  turmaId: number;

  @IsNotEmpty()
  @IsString()
  anoLetivo: string;
}