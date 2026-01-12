import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TipoAvaliacao {
  TESTE = 'TESTE',
  PROVA = 'PROVA',
}

export enum Periodo {
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  B4 = 'B4',
}

export class CreateAvaliacaoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TipoAvaliacao)
  tipo: TipoAvaliacao;

  @IsEnum(Periodo)
  periodo: Periodo;

  @IsString()
  @IsNotEmpty()
  anoLetivo: string;

  @Type(() => Number)
  @IsInt()
  turmaId: number;

  @Type(() => Number)
  @IsInt()
  disciplinaId: number;

  @IsOptional()
  @IsString()
  ficheiroUrl?: string;
}


