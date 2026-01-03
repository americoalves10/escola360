import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Avaliacao } from "./avaliacao.entity";
import { Alternativa } from "./alternativa.entity";

export enum TipoQuestao {
  OBJETIVA = 'OBJETIVA',
  MULTIPLA = 'MULTIPLA',
  DISCURSIVA = 'DISCURSIVA',
}

@Entity('questao')
export class Questao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  enunciado: string;

  @Column({ type: 'enum', enum: TipoQuestao })
  tipo: TipoQuestao;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  valor: number;

  @ManyToOne(() => Avaliacao, a => a.questoes)
  @JoinColumn({ name: 'avaliacao_id' })
  avaliacao: Avaliacao;

  @OneToMany(() => Alternativa, a => a.questao)
  alternativas: Alternativa[];
}
