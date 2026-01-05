import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Turma } from 'src/turma/entity/turma.entity';
import { Professor } from 'src/professor/entity/professor.entity';

@Entity('disciplina')
export class Disciplina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  codDisciplina: string;

  @Column()
  status: string;

  @Column()
  cargaHoraria: number;

  @Column()
  assunto: string;

}