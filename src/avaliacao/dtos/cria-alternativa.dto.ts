import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlternativaDto {
  @IsNumber()
  questaoId: number;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsBoolean()
  correta: boolean;
}
