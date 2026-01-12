import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Turma } from 'src/turma/entity/turma.entity';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Professor } from 'src/professor/entity/professor.entity';

export enum TipoAvaliacao {
  TESTE = 'TESTE',
  PROVA = 'PROVA',
}

export enum Periodo {
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  B4 = 'B4',
}

@Entity('avaliacao')
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'enum', enum: TipoAvaliacao })
  tipo: TipoAvaliacao;

  @Column({ type: 'enum', enum: Periodo })
  periodo: Periodo;

  @Column()
  anoLetivo: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @ManyToOne(() => Disciplina)
  @JoinColumn({ name: 'disciplina_id' })
  disciplina: Disciplina;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @Column({ nullable: true })
  ficheiroUrl?: string;

  @Column({ default: false })
  visivelParaAluno: boolean;

  @CreateDateColumn()
  createdAt: Date;
}


