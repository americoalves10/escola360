import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class TurmaDto {

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  turno?: string;

}
