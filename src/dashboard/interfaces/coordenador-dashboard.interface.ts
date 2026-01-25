export interface CoordenadorDashboard {

  indicadoresGerais: {
    totalAlunos: number;
    totalProfessores: number;
    totalTurmas: number;
    mediaGeralEscola: number;
  };

  mediasPorTurma: {
    turmaId: number;
    turma: string;
    media: number;
  }[];

  mediasPorDisciplina: {
    disciplinaId: number;
    disciplina: string;
    media: number;
  }[];

  entregasAvaliacoes: {
    entregues: number;
    pendentes: number;
  };

  alunosEmRisco: {
    alunoId: number;
    aluno: string;
    turma: string;
    media: number;
  }[];
}
