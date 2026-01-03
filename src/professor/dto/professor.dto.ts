import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class ProfessorDto{

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
   dataAdmissao: Date;
   
   @IsOptional()
   @IsNotEmpty()
   @IsString()
   status: string;
   
   @IsOptional()
   @IsNotEmpty()
   @IsString()
   formacaoAcad: string;
   
   @IsOptional()
   @IsNotEmpty()
   @IsString()
   titulacao: string;
   
   @IsOptional()
   @IsNotEmpty()
   @IsString()
   deficiencia: string;
   
   @IsOptional()
   
   @IsString()
   tipoDeficiencia: string;
   
   @IsOptional()
   @IsNotEmpty({message:'O e-mail não pode ser vazio.'})
   @IsEmail({},{message:'forneça um e-mail válido.'})
   email: string;

   @IsOptional()
   @IsNotEmpty({message: 'A senha não pode ser vazia.'})
   @MinLength(6,{message: 'A senha deve ter no mínimo 6 caracteres.'})
   password: string;
   
}


