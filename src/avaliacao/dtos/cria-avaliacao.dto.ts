import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAvaliacaoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  descricao: string;

  @IsNumber()
  valor_total: number;

  @IsNumber()
  turmaProfessorDisciplinaId: number;
}