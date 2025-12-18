import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DisciplinaDto {
    @IsNotEmpty()
    nome: string;

    @IsNotEmpty()
    codDisciplina: string;
  
    @IsNotEmpty()
    status: string;
  
    @IsNotEmpty()
    cargaHoraria: number;
    
    @IsNotEmpty()
    assunto: string;
    
}
