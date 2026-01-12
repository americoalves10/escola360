import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoDto } from './create-avaliacao.dto';

export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto){
  @IsOptional()
  @IsString()
  ficheiroUrl?: string;

  @IsOptional()
  @IsBoolean()
  visivelParaAluno?: boolean;
}
