import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UserDto {

   @IsOptional()
   @IsString()
   matricula: string;

   @IsOptional()
   @IsString()
   nome: string;

   @IsOptional()
   @IsString()
   cpf: string;

   @IsOptional()
   @IsString()
   status: string;

   @IsOptional()
   @IsDateString()
   dataNasc?: string;

   @IsOptional()
   @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
   @IsEmail({}, { message: 'forneça um e-mail válido.' })
   email: string;

   @IsOptional()
   @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
   @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
   password: string;
}