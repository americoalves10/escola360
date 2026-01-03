import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Questao } from "./questao.entity";

@Entity('alternativa')
export class Alternativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  descricao: string;

  @Column({ default: false })
  correta: boolean;

  @ManyToOne(() => Questao, q => q.alternativas)
  @JoinColumn({ name: 'questao_id' })
  questao: Questao;
}
