import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class TurmaDto {
  
  nome: string;
  
  turno?: string;
  
}
