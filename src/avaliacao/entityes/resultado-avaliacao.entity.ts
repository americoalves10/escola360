import { Aluno } from "src/aluno/entity/aluno.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Avaliacao } from "./avaliacao.entity";

@Entity('resultado_avaliacao')
export class ResultadoAvaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Aluno)
  @JoinColumn({ name: 'aluno_id' })
  aluno: Aluno;

  @ManyToOne(() => Avaliacao)
  @JoinColumn({ name: 'avaliacao_id' })
  avaliacao: Avaliacao;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  nota_final: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentual: number;

  @Column({ default: false })
  finalizado: boolean;
}
