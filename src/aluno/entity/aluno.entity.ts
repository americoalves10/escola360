import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email'])
export class User{


   @PrimaryGeneratedColumn('uuid') //protege a identidade do usuário na criação
   id: string;

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