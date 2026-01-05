import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
import { Professor } from 'src/professor/entity/professor.entity';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Turma } from 'src/turma/entity/turma.entity';

export enum TipoMaterial {
  VIDEO = 'video',
  PDF = 'pdf',
  DOC = 'doc',
  PPT = 'ppt',
}

@Entity('material_didatico')
export class MaterialDidatico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: TipoMaterial })
  tipo: TipoMaterial;

  @Column({ nullable: true })
  ficheiroUrl: string;

  @Column({ nullable: true })
  linkVideo: string;

  @ManyToOne(() => Disciplina)
  @JoinColumn({ name: 'disciplina_id' })
  disciplina: Disciplina;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @Column({ default: true })
  visivel: boolean;

  @Column({ type: 'datetime', nullable: true })
  dataPublicacao: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}