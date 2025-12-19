import { Matricula } from "src/matricula/entity/matricula.entity";
import { TurmaProfessorDisciplina } from "src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('matricula_disciplina')
@Unique(['matricula', 'turmaProfessorDisciplina'])
export class MatriculaDisciplina {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Matricula, m => m.disciplinas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matricula_id' })
  matricula: Matricula;

  @ManyToOne(() => TurmaProfessorDisciplina, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turma_professor_disciplina_id' })
  turmaProfessorDisciplina: TurmaProfessorDisciplina;

//   @ManyToOne(() => Turma, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'turma_id' })
//   turma: Turma;
}