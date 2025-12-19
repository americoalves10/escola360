import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index, OneToMany } from "typeorm";
import { Aluno } from "src/aluno/entity/aluno.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { MatriculaDisciplina } from 'src/matricula-disciplina/entity/matriculaDisciplina.entity';

@Entity('matricula')
@Unique(['aluno', 'turma'])
@Index(['aluno', 'anoLetivo'], { unique: true })
export class Matricula {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  anoLetivo: string;

  // Muitos alunos para uma matrícula (ou vice-versa)
  @ManyToOne(() => Aluno, { eager: true })
  @JoinColumn({ name: 'alunoId' }) // Nome da coluna no banco
  aluno: Aluno;

  @ManyToOne(() => Turma, { eager: true })
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @OneToMany(
    () => MatriculaDisciplina,
    md => md.matricula,
    { cascade: true }
  )
  disciplinas: MatriculaDisciplina[];
}
