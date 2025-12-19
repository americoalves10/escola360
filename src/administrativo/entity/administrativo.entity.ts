import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity('useradm')
@Unique(['email', 'cpf', 'matricula'])
export class Useradm {
   @PrimaryGeneratedColumn() 
   id: number;

   @Column()
   matricula: string;
   
   @Column()
   nome: string;
   
   @Column()
   cpf: string;
   
   @Column()
   status: string;
   
   @Column()
   dataNasc: Date;

   @Column()
   email: string;

   @Column()
   password: string;

}
