import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CorrigirSubmissaoDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  nota: number;

  @IsOptional()
  @IsString()
  pontosFortes?: string;

  @IsOptional()
  @IsString()
  pontosMelhorar?: string;
}
