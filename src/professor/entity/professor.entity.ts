import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Professor {

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
   deficiencia: string;

   @Column()
   tipoDeficiencia: string;

   @Column()
   email: string;

   @Column()
   password: string;

}
