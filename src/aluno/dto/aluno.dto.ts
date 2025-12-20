import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsDate } from "class-validator";

export class UserDto {
   @IsNotEmpty()
   @IsString()
   matricula: string;

   @IsNotEmpty()
   @IsString()
   nome: string;

   @IsNotEmpty()
   @IsString()
   cpf: string;

   @Type(() => Date)
   @IsDate()
   dataNasc: Date;

   @IsNotEmpty()
   @IsString()
   status: string;   

   @IsOptional() // Use IsOptional se o campo puder ser vazio
   @IsString()
   deficiencia: string;

   @IsOptional()
   @IsString()
   tipoDeficiencia: string;
   
   @IsNotEmpty({message:'O e-mail não pode ser vazio.'})
   @IsEmail({},{message:'forneça um e-mail válido.'})
   email: string;

   @IsNotEmpty({message: 'A senha não pode ser vazia.'})
   @MinLength(6,{message: 'A senha deve ter no mínimo 6 caracteres.'})
   password: string;
}