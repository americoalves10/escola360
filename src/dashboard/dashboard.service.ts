// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfessorDashboard } from './interfaces/professor-dashboard.interface';
import { AlunoDashboard } from './interfaces/aluno-dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) { }

  async alunoDashboardPorDisciplina(alunoId: number, disciplinaId: number) {
    const evolucaoNotas = await this.dataSource.query(`
    SELECT 
      a.titulo AS avaliacao,
      s.nota AS nota,
      s.dataSubmissao AS data
    FROM submissao_avaliacao s
    JOIN avaliacao a ON a.id = s.avaliacao_id
    WHERE s.aluno_id = ?
      AND a.disciplina_id = ?
    ORDER BY s.dataSubmissao
  `, [alunoId, disciplinaId]);

    const mediaResult = await this.dataSource.query(`
            SELECT AVG(nota) AS media
            FROM submissao_avaliacao
            WHERE aluno_id = ?
            `, [alunoId]);

    return {
      alunoId,
      disciplinaId,
      media: Number(mediaResult[0]?.media ?? 0),
      evolucaoNotas
    };
  }

  async dashboardProfessor(
    professorId: number,
  ): Promise<ProfessorDashboard> {

    const turmas = await this.dataSource.query(`
    SELECT
      t.id AS turmaId,
      t.nome AS turma,
      d.id AS disciplinaId,
      d.nome AS disciplina
    FROM turma_professor_disciplina tpd
    INNER JOIN turma t ON t.id = tpd.turma_id
    INNER JOIN disciplina d ON d.id = tpd.disciplina_id
    WHERE tpd.professor_id = ?
  `, [professorId]);

const avaliacoes = await this.dataSource.query(`
  SELECT
    a.id AS id,
    a.titulo AS titulo,
    a.tipo AS tipo,
    t.nome AS turma,
    d.nome AS disciplina,
    COUNT(sa.id) AS pendentes,
    MAX(sa.dataSubmissao) AS ultimaSubmissao
  FROM turma_professor_disciplina tpd
  INNER JOIN turma t
    ON t.id = tpd.turma_id
  INNER JOIN disciplina d
    ON d.id = tpd.disciplina_id
  INNER JOIN avaliacao a
    ON a.disciplina_id = d.id
  LEFT JOIN submissao_avaliacao sa
    ON sa.avaliacao_id = a.id
   AND sa.nota IS NULL
  WHERE tpd.professor_id = ?
  GROUP BY
    a.id,
    a.titulo,
    a.tipo,
    t.nome,
    d.nome
  ORDER BY
    ultimaSubmissao DESC
`, [professorId]);

    return {
      turmas,
      avaliacoes,
    };
  }

  async totalAlunosPorTurma() {
    return this.dataSource.query(`
    SELECT
      t.id AS turmaId,
      t.nome AS turma,
      COUNT(DISTINCT m.alunoId) AS totalAlunos
    FROM turma t
    INNER JOIN turma_professor_disciplina tpd
      ON tpd.turma_id = t.id
    INNER JOIN matricula_disciplina md
      ON md.turma_professor_disciplina_id = tpd.id
    INNER JOIN matricula m
      ON m.id = md.matricula_id
    GROUP BY t.id, t.nome
    ORDER BY t.nome
  `);
  }

  async mediaTurmaPorDisciplina() {
  return this.dataSource.query(`
    SELECT
      t.id AS turmaId,
      t.nome AS turma,
      d.id AS disciplinaId,
      d.nome AS disciplina,
      ROUND(AVG(sa.nota), 2) AS media
    FROM submissao_avaliacao sa
    INNER JOIN avaliacao a
      ON a.id = sa.avaliacao_id
    INNER JOIN disciplina d
      ON d.id = a.disciplina_id
    INNER JOIN turma_professor_disciplina tpd
      ON tpd.disciplina_id = d.id
    INNER JOIN turma t
      ON t.id = tpd.turma_id
    WHERE sa.nota IS NOT NULL
    GROUP BY
      t.id,
      t.nome,
      d.id,
      d.nome
    ORDER BY
      t.nome,
      d.nome
  `);
}



}
