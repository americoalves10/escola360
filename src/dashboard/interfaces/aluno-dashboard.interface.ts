export interface EvolucaoNota {
  avaliacao: string;
  data: Date;
  nota: number;
}

export interface AvaliacaoPendente {
  avaliacao: string;
  dataEntrega: Date;
}

export interface AlunoDashboard {
  alunoId: number;
  mediaGeral: number;
  evolucaoNotas: EvolucaoNota[];
  avaliacoesPendentes: AvaliacaoPendente[];
}
