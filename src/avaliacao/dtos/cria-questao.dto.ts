import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TipoQuestao } from '../entityes/questao.entity';

export class CreateQuestaoDto {
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsEnum(TipoQuestao)
  tipo: TipoQuestao;

  @IsNumber()
  valor: number;

  @IsNumber()
  avaliacaoId: number;
}