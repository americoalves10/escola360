import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ResponderQuestaoDiscursivaDto {
  @IsNumber()
  questaoId: number;

  @IsString()
  @IsNotEmpty()
  respostaTexto: string;
}