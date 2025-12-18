import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class TurmaDto {
  
  @IsNotEmpty()
  nome: string;
  
  turno?: string;
  
}
