import { TurmaProfessorDisciplina } from "src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Questao } from "./questao.entity";

@Entity('avaliacao')
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  valor_total: number;

  @Column({ default: 'ATIVA' })
  status: string;

  @ManyToOne(() => TurmaProfessorDisciplina)
  @JoinColumn({ name: 'turma_professor_disciplina_id' })
  turmaProfessorDisciplina: TurmaProfessorDisciplina;

  @OneToMany(() => Questao, q => q.avaliacao)
  questoes: Questao[];
}
