import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { TipoMaterial } from '../entity/material-didatico.entity';

export class CreateMaterialDidaticoDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsEnum(TipoMaterial)
  tipo: TipoMaterial;

  @IsOptional()
  @IsString()
  ficheiroUrl?: string;

  @IsOptional()
  @IsString()
  linkVideo?: string;

  @IsNumber()
  disciplinaId: number;

  @IsNumber()
  turmaId: number;
}

