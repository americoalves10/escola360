import { Disciplina } from "src/disciplina/entity/disciplina.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['email', 'cpf', 'matricula'])
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
