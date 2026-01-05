import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsDate } from "class-validator";

export class UserDto {

   @IsOptional()
   @IsNotEmpty()
   @IsString()
   matricula: string;

   @IsOptional()
   @IsNotEmpty()
   @IsString()
   nome: string;

   @IsOptional()
   @IsNotEmpty()
   @IsString()
   cpf: string;

   @IsOptional()
   @Type(() => Date)
   @IsDate()
   dataNasc: Date;

   @IsOptional()
   @IsNotEmpty()
   @IsString()
   status: string;

   @IsOptional() // Use IsOptional se o campo puder ser vazio
   @IsString()
   deficiencia: string;

   @IsOptional()
   @IsString()
   tipoDeficiencia: string;

   @IsOptional()
   @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
   @IsEmail({}, { message: 'forneça um e-mail válido.' })
   email: string;

   @IsOptional()
   @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
   @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
   password: string;
}