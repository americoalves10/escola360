import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from 'src/aluno/entity/aluno.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { MatriculaDisciplina } from 'src/matricula-disciplina/entity/matriculaDisciplina.entity';

@Entity('matricula')
@Unique(['aluno', 'turma'])
@Index(['aluno', 'anoLetivo'], { unique: true })
export class Matricula {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  anoLetivo: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  aluno: User;

  @ManyToOne(() => Turma, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turma_id' })
  turma: Turma;

  @OneToMany(
    () => MatriculaDisciplina,
    md => md.matricula,
    { cascade: true }
  )
  disciplinas: MatriculaDisciplina[];
}