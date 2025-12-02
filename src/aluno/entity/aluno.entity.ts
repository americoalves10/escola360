import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email'])
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
   email: string;

   @Column()
   password: string;


}