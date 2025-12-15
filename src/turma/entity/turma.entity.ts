import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { Professor } from 'src/professor/entity/professor.entity';
import { Useradm } from 'src/administrativo/entity/administrativo.entity';
import { User } from 'src/aluno/entity/aluno.entity';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  turno: string;
  
}
