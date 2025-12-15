import { Turma } from "src/turma/entity/turma.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


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
   
   @ManyToOne(() => Turma, { eager: true })
   @JoinColumn({ name: 'id_turma' })
   turma: Turma;

   @Column()
   deficiencia: string;

   @Column()
   tipoDeficiencia: string;

   @Column()
   email: string;

   @Column()
   password: string;


}