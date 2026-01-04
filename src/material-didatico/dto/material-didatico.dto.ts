import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { TipoMaterial } from '../entity/material-didatico.entity';

export class CreateMaterialDidaticoDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  descricao?: string;

  @IsEnum(TipoMaterial)
  tipo: TipoMaterial;

  @IsOptional()
  ficheiroUrl?: string;

  @IsOptional()
  linkVideo?: string;

  @IsNumber()
  disciplinaId: number;

  @IsNumber()
  turmaId: number;

  @IsOptional()
  dataPublicacao?: Date;
}
