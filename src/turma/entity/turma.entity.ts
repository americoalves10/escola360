import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  turno: string;

}
