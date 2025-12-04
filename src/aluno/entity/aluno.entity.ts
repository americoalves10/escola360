import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email', 'cpf', 'matricula'])
export class User{


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
   turma: string;

   @Column()
   anoLetivo: number;

   @Column()
   email: string;

   @Column()
   password: string;


}