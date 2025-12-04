import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email'])
export class Useradm{


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
   cargoFuncao: string;

   @Column()
   anoLetivo: number;
 
   @Column()
   email: string;

   @Column()
   password: string;

}
