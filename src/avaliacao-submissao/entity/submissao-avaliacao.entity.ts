import { Aluno } from "src/aluno/entity/aluno.entity";
import { Avaliacao } from "src/avaliacao/entity/avaliacao.entity";
import { Disciplina } from "src/disciplina/entity/disciplina.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('submissao_avaliacao')
export class SubmissaoAvaliacao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Avaliacao)
    @JoinColumn({ name: 'avaliacao_id' })
    avaliacao: Avaliacao;

    @ManyToOne(() => Aluno)
    @JoinColumn({ name: 'aluno_id' })
    aluno: Aluno;

    @ManyToOne(() => Turma)
    turma: Turma;

    @ManyToOne(() => Disciplina)
    disciplina: Disciplina;

    @Column()
    ficheiroResposta: string;

    @Column({ type: 'float', nullable: true })
    nota: number;

    @Column({ type: 'text', nullable: true })
    pontosFortes: string | null;

    @Column({ type: 'text', nullable: true })
    pontosMelhorar: string | null;


    @Column({ default: 'SUBMETIDO' })
    estado: 'SUBMETIDO' | 'CORRIGIDO';

    @CreateDateColumn()
    dataSubmissao: Date;
}