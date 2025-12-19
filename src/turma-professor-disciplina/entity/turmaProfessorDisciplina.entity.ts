import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Professor } from 'src/professor/entity/professor.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';

@Entity('turma_professor_disciplina')
@Unique(['professor', 'turma', 'disciplina'])
export class TurmaProfessorDisciplina {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @ManyToOne(() => Turma, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @ManyToOne(() => Disciplina, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'disciplina_id' })
  disciplina: Disciplina;
}
