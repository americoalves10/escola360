export interface ProfessorDashboard {
  turmas: {
    turmaId: number;
    turma: string;
    disciplinaId: number;
    disciplina: string;
  }[];

  avaliacoes: {
    id: number;
    titulo: string;
    tipo: string;
    dataAplicacao: Date;
    turma: string;
    disciplina: string;
  }[];
  
}
