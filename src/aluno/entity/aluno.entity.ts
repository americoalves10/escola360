import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('aluno') // Nome explícito da tabela
@Unique("unique_aluno_matricula", ["matricula"])
export class Aluno { // Renomeado de User para Aluno
   @PrimaryGeneratedColumn() 
   id: number;

   @Column()
   matricula: string;
   
   @Column()
   nome: string;
   
   @Column()
   cpf: string;
   
   @Column()
   dataNasc: Date;
   
   @Column()
   status: string;
      
   @Column()
   deficiencia: string;

   @Column()
   tipoDeficiencia: string;

   @Column()
   email: string;

   @Column()
   password: string;
}