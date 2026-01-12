import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissaoAvaliacao } from 'src/avaliacao-submissao/entity/submissao-avaliacao.entity';
import { HistoricoAlunoDto } from './dto/historico-aluno.dto';

@Injectable()
export class HistoricoService {
  constructor(
    @InjectRepository(SubmissaoAvaliacao)
    private readonly repo: Repository<SubmissaoAvaliacao>,
  ) {}

  async gerarHistoricoAluno(alunoId: number): Promise<HistoricoAlunoDto> {
    const submissoes = await this.repo.find({
      where: {
        aluno: { id: alunoId },
        estado: 'CORRIGIDO',
      },
      relations: [
        'avaliacao',
        'avaliacao.disciplina',
        'avaliacao.professor',
        'avaliacao.turma',
        'aluno',
        'aluno.matriculas',
        'aluno.matriculas.turma',
      ],
    });

    if (!submissoes.length) {
      return {
        alunoId,
        aluno: '',
        turma: '',
        anoLetivo: '',
        disciplinas: [],
      };
    }

    const aluno = submissoes[0].aluno;
    const turma = submissoes[0].avaliacao.turma;

    // 🔑 MATRÍCULA CORRETA
    const matricula = aluno.matriculas.find(
      m => m.turma.id === turma.id,
    );

    if (!matricula) {
      throw new NotFoundException(
        'Matrícula não encontrada para esta turma',
      );
    }

    const disciplinasMap = new Map<number, any>();

    for (const sub of submissoes) {
      const { disciplina, periodo, tipo, professor } = sub.avaliacao;

      if (!disciplinasMap.has(disciplina.id)) {
        disciplinasMap.set(disciplina.id, {
          disciplinaId: disciplina.id,
          disciplina: disciplina.nome,
          professor: professor.nome,
          bimestres: {},
          mediaAnual: null,
          situacao: 'CURSANDO',
        });
      }

      const disc = disciplinasMap.get(disciplina.id);

      if (!disc.bimestres[periodo]) {
        disc.bimestres[periodo] = {
          teste: null,
          prova: null,
          media: null,
        };
      }

      disc.bimestres[periodo][tipo.toLowerCase()] = sub.nota;
    }

    // 📊 MÉDIAS
    disciplinasMap.forEach(disc => {
      const mediasBimestrais: number[] = [];

      Object.values(disc.bimestres).forEach((bim: any) => {
        if (bim.teste !== null && bim.prova !== null) {
          bim.media = Number(((bim.teste + bim.prova) / 2).toFixed(2));
          mediasBimestrais.push(bim.media);
        }
      });

      if (mediasBimestrais.length) {
        const soma = mediasBimestrais.reduce((a, b) => a + b, 0);
        disc.mediaAnual = Number((soma / mediasBimestrais.length).toFixed(2));
        disc.situacao =
          disc.mediaAnual >= 7 ? 'APROVADO' : 'REPROVADO';
      }
    });

    return {
      alunoId,
      aluno: aluno.nome,
      turma: turma.nome,
      anoLetivo: matricula.anoLetivo,
      disciplinas: Array.from(disciplinasMap.values()),
    };
  }
}
