import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
// import { ProfessorTurma } from 'src/turma-professor-disciplina/entity/professorTurmaDisciplina.entity';
// import { Professor } from 'src/professor/entity/professor.entity';
// import { Useradm } from 'src/administrativo/entity/administrativo.entity';
// import { User } from 'src/aluno/entity/aluno.entity';
// import { Disciplina } from 'src/disciplina/entity/disciplina.entity';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  turno: string;  
  
}
