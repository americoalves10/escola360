import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class ProfessorDto{

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
   dataAdmissao: Date;
   
   @IsNotEmpty()
   @IsString()
   status: string;
   
   @IsNotEmpty()
   @IsString()
   formacaoAcad: string;
   
   @IsNotEmpty()
   @IsString()
   titulacao: string;
   
   @IsNotEmpty()
   @IsString()
   deficiencia: string;
   
   @IsNotEmpty()
   @IsString()
   tipoDeficiencia: string;
   
   @IsNotEmpty({message:'O e-mail não pode ser vazio.'})
   @IsEmail({},{message:'forneça um e-mail válido.'})
   email: string;

   @IsNotEmpty({message: 'A senha não pode ser vazia.'})
   @MinLength(6,{message: 'A senha deve ter no mínimo 6 caracteres.'})
   password: string;
   
}


