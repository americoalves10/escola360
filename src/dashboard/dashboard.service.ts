import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfessorDashboard } from './interfaces/professor-dashboard.interface';
import { AlunoDashboard } from './interfaces/aluno-dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) { }

  async dashboardCoordenador() {
    const [
      indicadoresGerais,
      mediasPorTurma,
      mediasPorDisciplina,
      entregasAvaliacoes,
      alunosEmRisco,
    ] = await Promise.all([
      this.indicadoresGerais(),
      this.mediasPorTurma(),
      this.mediasPorDisciplina(),
      this.entregasAvaliacoes(),
      this.alunosEmRisco(),
    ]);

    return {
      indicadoresGerais,
      mediasPorTurma,
      mediasPorDisciplina,
      entregasAvaliacoes,
      alunosEmRisco,
    };
  }

  async indicadoresGerais() {
    const [[alunos], [professores], [turmas], [media]] = await Promise.all([
      this.dataSource.query(`SELECT COUNT(*) total FROM aluno`),
      this.dataSource.query(`SELECT COUNT(*) total FROM professor`),
      this.dataSource.query(`SELECT COUNT(*) total FROM turma`),
      this.dataSource.query(`
        SELECT ROUND(AVG(nota), 2) media
        FROM submissao_avaliacao
        WHERE nota IS NOT NULL
      `),
    ]);

    return {
      totalAlunos: Number(alunos.total),
      totalProfessores: Number(professores.total),
      totalTurmas: Number(turmas.total),
      mediaGeralEscola: Number(media.media ?? 0),
    };
  }

  async mediasPorTurma() {
    return this.dataSource.query(`
      SELECT
        t.id AS turmaId,
        t.nome AS turma,
        d.id AS disciplinaId,
        d.nome AS disciplina,
        ROUND(COALESCE(AVG(sa.nota), 0), 2) AS media
      FROM turma t
      LEFT JOIN turma_professor_disciplina tpd
        ON tpd.turma_id = t.id
      LEFT JOIN disciplina d
        ON d.id = tpd.disciplina_id
      LEFT JOIN avaliacao a
        ON a.disciplina_id = d.id
      LEFT JOIN submissao_avaliacao sa
        ON sa.avaliacao_id = a.id
      GROUP BY
        t.id,
        t.nome,
        d.id,
        d.nome
      ORDER BY
        t.nome,
        d.nome;

      `);
  }

  async mediasPorDisciplina() {
    return this.dataSource.query(`
      SELECT
        d.id AS disciplinaId,
        d.nome AS disciplina,
        ROUND(COALESCE(AVG(sa.nota), 0), 2) AS media
      FROM disciplina d
      LEFT JOIN avaliacao a
        ON a.disciplina_id = d.id
      LEFT JOIN submissao_avaliacao sa
        ON sa.avaliacao_id = a.id
      GROUP BY d.id, d.nome
      ORDER BY d.nome
    `);
  }

  async entregasAvaliacoes() {
    const [result] = await this.dataSource.query(`
      SELECT
        SUM(CASE WHEN sa.id IS NOT NULL THEN 1 ELSE 0 END) AS entregues,
        SUM(CASE WHEN sa.id IS NULL THEN 1 ELSE 0 END) AS pendentes
      FROM avaliacao a
      LEFT JOIN submissao_avaliacao sa
        ON sa.avaliacao_id = a.id
    `);

    return {
      entregues: Number(result.entregues),
      pendentes: Number(result.pendentes),
    };
  }

  async alunosEmRisco() {
    return this.dataSource.query(`
    SELECT
      al.id AS alunoId,
      al.nome AS aluno,
      t.nome AS turma,
      d.nome AS disciplina,
      ROUND(AVG(sa.nota), 2) AS media
    FROM aluno al

    /* matrícula mais recente */
    INNER JOIN matricula m
      ON m.id = (
        SELECT m2.id
        FROM matricula m2
        WHERE m2.alunoId = al.id
        ORDER BY m2.id DESC
        LIMIT 1
      )

    INNER JOIN matricula_disciplina md
      ON md.matricula_id = m.id

    INNER JOIN turma_professor_disciplina tpd
      ON tpd.id = md.turma_professor_disciplina_id

    INNER JOIN turma t
      ON t.id = tpd.turma_id

    INNER JOIN disciplina d
      ON d.id = tpd.disciplina_id

    /* garante que a nota é DAQUELA disciplina */
    INNER JOIN submissao_avaliacao sa
      ON sa.aluno_id = al.id

    INNER JOIN avaliacao av
      ON av.id = sa.avaliacao_id
     AND av.disciplina_id = d.id

    WHERE sa.nota IS NOT NULL

    GROUP BY
      al.id,
      al.nome,
      t.nome,
      d.id,
      d.nome

    HAVING media < 7

    ORDER BY media ASC
  `);
  }

  async alunoDashboardPorDisciplina(alunoId: number, disciplinaId: number) {

    const evolucaoNotas = await this.dataSource.query(`
    SELECT 
      a.titulo AS avaliacao,
      s.nota AS nota,
      s.dataSubmissao AS data
    FROM submissao_avaliacao s
    INNER JOIN avaliacao a ON a.id = s.avaliacao_id
    WHERE s.aluno_id = ?
      AND a.disciplina_id = ?
    ORDER BY s.dataSubmissao
  `, [alunoId, disciplinaId]);

    const [mediaAluno] = await this.dataSource.query(`
    SELECT ROUND(AVG(s.nota), 2) AS media
    FROM submissao_avaliacao s
    INNER JOIN avaliacao a ON a.id = s.avaliacao_id
    WHERE s.aluno_id = ?
      AND a.disciplina_id = ?
  `, [alunoId, disciplinaId]);

    const [aluno] = await this.dataSource.query(`
    SELECT nome FROM aluno WHERE id = ?
  `, [alunoId]);

    const [mediaTurma] = await this.dataSource.query(`
    SELECT ROUND(AVG(sa.nota), 2) AS media
    FROM submissao_avaliacao sa
    INNER JOIN avaliacao a ON a.id = sa.avaliacao_id
    WHERE a.disciplina_id = ?
  `, [disciplinaId]);

    return {
      nomeAluno: aluno?.nome ?? '—',
      mediaAluno: Number(mediaAluno?.media ?? 0),
      mediaTurma: Number(mediaTurma?.media ?? 0),
      evolucaoNotas
    };
  }


  async feedbacksAluno(alunoId: number) {
    return this.dataSource.query(`
      SELECT
        a.titulo AS avaliacao,
        d.nome AS disciplina,
        sa.nota,
        sa.pontosFortes,
        sa.pontosMelhorar
      FROM submissao_avaliacao sa
      INNER JOIN avaliacao a
        ON a.id = sa.avaliacao_id
      INNER JOIN disciplina d
        ON d.id = a.disciplina_id
      WHERE sa.aluno_id = ?
        AND sa.nota IS NOT NULL
      ORDER BY d.nome, a.titulo
    `, [alunoId]);
  }


  async dashboardProfessor(professorId: number): Promise<ProfessorDashboard & { nomeProfessor: string }> {

    const [professor] = await this.dataSource.query(`
      SELECT nome FROM professor WHERE id = ?
    `, [professorId]);

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
          a.titulo,
          COUNT(sa.id) AS pendentes
        FROM turma_professor_disciplina tpd
        INNER JOIN avaliacao a
          ON a.disciplina_id = tpd.disciplina_id
        INNER JOIN submissao_avaliacao sa
          ON sa.avaliacao_id = a.id
        WHERE tpd.professor_id = ?
          AND sa.nota IS NULL
        GROUP BY a.id
        HAVING pendentes > 0;
    `, [professorId]);

    return {
      nomeProfessor: professor?.nome ?? 'Professor',
      turmas,
      avaliacoes,
    };
  }

  async mediasTurmasProfessor(professorId: number) {
    return this.dataSource.query(`
    SELECT
      t.nome AS turma,
      d.nome AS disciplina,
      ROUND(AVG(sa.nota), 2) AS media
    FROM turma_professor_disciplina tpd
    INNER JOIN turma t
      ON t.id = tpd.turma_id
    INNER JOIN disciplina d
      ON d.id = tpd.disciplina_id
    INNER JOIN avaliacao a
      ON a.disciplina_id = d.id
    INNER JOIN submissao_avaliacao sa
      ON sa.avaliacao_id = a.id
    INNER JOIN matricula m
      ON m.alunoId = sa.aluno_id
      AND m.turmaId = t.id
    WHERE tpd.professor_id = ?
      AND sa.nota IS NOT NULL
    GROUP BY t.id, d.id
    ORDER BY t.nome;
  `, [professorId]);
  }


  async mediaTurmaPorDisciplina() {
    return this.dataSource.query(`
      SELECT
        t.id AS turmaId,
        t.nome AS turma,
        d.id AS disciplinaId,
        d.nome AS disciplina,
        ROUND(COALESCE(AVG(sa.nota), 0), 2) AS media
      FROM turma t
      INNER JOIN turma_professor_disciplina tpd
        ON tpd.turma_id = t.id
      INNER JOIN disciplina d
        ON d.id = tpd.disciplina_id
      LEFT JOIN avaliacao a
        ON a.disciplina_id = d.id
      LEFT JOIN submissao_avaliacao sa
        ON sa.avaliacao_id = a.id
      GROUP BY
        t.id,
        t.nome,
        d.id,
        d.nome
      ORDER BY
        t.nome,
        d.nome;

    `);
  }

  async mediaTurma(professorId: number) {
    return this.dataSource.query(`
    SELECT
      t.nome AS turma,
      ROUND(AVG(sa.nota), 2) AS media
    FROM turma_professor_disciplina tpd
    INNER JOIN turma t
      ON t.id = tpd.turma_id
    INNER JOIN avaliacao a
      ON a.disciplina_id = tpd.disciplina_id
    INNER JOIN submissao_avaliacao sa
      ON sa.avaliacao_id = a.id
    INNER JOIN matricula m
      ON m.alunoId = sa.aluno_id
      AND m.turmaId = t.id
    WHERE tpd.professor_id = ?
      AND sa.nota IS NOT NULL
    GROUP BY t.id
    ORDER BY t.nome;
  `, [professorId]);
  }


  async feedbacksProfessor(professorId: number) {
    return this.dataSource.query(`
    SELECT
      t.nome AS turma,
      d.nome AS disciplina,
      al.nome AS aluno,
      a.titulo AS avaliacao,
      sa.nota,
      sa.pontosFortes,
      sa.pontosMelhorar
    FROM turma_professor_disciplina tpd
    INNER JOIN turma t
      ON t.id = tpd.turma_id
    INNER JOIN disciplina d
      ON d.id = tpd.disciplina_id
    INNER JOIN avaliacao a
      ON a.disciplina_id = d.id
    INNER JOIN submissao_avaliacao sa
      ON sa.avaliacao_id = a.id
    INNER JOIN aluno al
      ON al.id = sa.aluno_id
    WHERE tpd.professor_id = ?
      AND sa.nota IS NOT NULL
    ORDER BY
      t.nome,
      d.nome,
      al.nome,
      a.titulo
  `, [professorId]);
  }

  async desempenhoTurmaProfessor(
    professorId: number,
    turmaId: number,
    periodo: string
  ) {
    return this.dataSource.query(`
    SELECT
      al.nome AS aluno,
      a.titulo AS avaliacao,
      sa.nota,
      sa.pontosFortes,
      sa.pontosMelhorar
    FROM turma_professor_disciplina tpd
    INNER JOIN turma t
      ON t.id = tpd.turma_id
    INNER JOIN disciplina d
      ON d.id = tpd.disciplina_id
    INNER JOIN avaliacao a
      ON a.disciplina_id = d.id
      AND a.periodo = ?
    INNER JOIN matricula m
      ON m.turmaId = t.id
    INNER JOIN matricula_disciplina md
      ON md.matricula_id = m.id
      AND md.turma_professor_disciplina_id = tpd.id
    INNER JOIN aluno al
      ON al.id = m.alunoId
    INNER JOIN submissao_avaliacao sa
      ON sa.avaliacao_id = a.id
      AND sa.aluno_id = al.id
    WHERE tpd.professor_id = ?
      AND t.id = ?
      AND sa.nota IS NOT NULL
    ORDER BY al.nome, a.titulo;
  `, [periodo, professorId, turmaId]);
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

}
