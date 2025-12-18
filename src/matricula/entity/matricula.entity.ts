import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/aluno/entity/aluno.entity';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';

@Entity('matricula')
@Index('unique_aluno_matricula', ['aluno'], { unique: true })
export class Matricula {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  aluno: User;

  @ManyToOne(() => TurmaProfessorDisciplina, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turma_professor_disciplina_id' })
  turmaProfessorDisciplina: TurmaProfessorDisciplina;
}
