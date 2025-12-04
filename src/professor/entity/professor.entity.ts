import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email'])
export class Professor{


   @PrimaryGeneratedColumn() 
   id: number;

   @Column()
   matricula: string;
   
   @Column()
   nome: string;
   
   @Column()
   cpf: string;
   
   @Column()
   dataAdmissao: Date;
   
   @Column()
   status: string;
   
   @Column()
   formacaoAcad: string;

   @Column()
   titulacao: string;

   @Column()
   email: string;

   @Column()
   password: string;


}
