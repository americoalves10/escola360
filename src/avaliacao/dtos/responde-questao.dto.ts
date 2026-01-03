import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ResponderQuestaoDto {
  @IsNumber()
  questaoId: number;

  @IsOptional()
  @IsNumber()
  alternativaId?: number;

  @IsOptional()
  @IsString()
  resposta_texto?: string;
}
