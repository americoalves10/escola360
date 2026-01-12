export class HistoricoDisciplinaDto {
  disciplinaId: number;
  disciplina: string;

  mediasBimestrais: {
    B1: number | null;
    B2: number | null;
    B3: number | null;
    B4: number | null;
  };

  mediaAnual: number | null;
  situacao: 'CURSANDO' | 'APROVADO' | 'REPROVADO';
}

export class HistoricoAlunoDto {
  alunoId: number;
  aluno: string;
  turma: string;
  anoLetivo: string;
  disciplinas: HistoricoDisciplinaDto[];
}