import { Aluno } from "src/aluno/entity/aluno.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Questao } from "./questao.entity";
import { Alternativa } from "./alternativa.entity";

@Entity('resposta_aluno')
export class RespostaAluno {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Aluno)
  @JoinColumn({ name: 'aluno_id' })
  aluno: Aluno;

  @ManyToOne(() => Questao)
  @JoinColumn({ name: 'questao_id' })
  questao: Questao;

  @ManyToOne(() => Alternativa, { nullable: true })
  @JoinColumn({ name: 'alternativa_id' })
  alternativa: Alternativa | null;

  @Column({ type: 'text', nullable: true })
  respostaTexto: string | null;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  correta: boolean | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nota: number | null;
}
