import { Turma } from "src/turma/entity/turma.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()

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
   deficiencia: string;

   @Column()
   tipoDeficiencia: string;

   @Column()
   email: string;

   @Column()
   password: string;

}