import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubmissaoAvaliacaoDto {
  @Type(() => Number)
  @IsInt()
  avaliacaoId: number;
}