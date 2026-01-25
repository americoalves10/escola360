import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AlunoDashboard } from './interfaces/aluno-dashboard.interface';
import { ProfessorDashboard } from './interfaces/professor-dashboard.interface';


@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('coordenador')
    dashboardCoordenador() {
        return this.dashboardService.dashboardCoordenador();
    }

    @Get('coordenador/medias/turmas')
    mediasPorTurma() {
        return this.dashboardService.mediasPorTurma();
    }

    @Get('coordenador/medias/disciplinas')
    mediasPorDisciplina() {
        return this.dashboardService.mediasPorDisciplina();
    }

    @Get('coordenador/entregas')
    entregasAvaliacoes() {
        return this.dashboardService.entregasAvaliacoes();
    }

    @Get('coordenador/alunos-risco')
    alunosEmRisco() {
        return this.dashboardService.alunosEmRisco();
    }

    @Get('aluno/:alunoId/disciplina/:disciplinaId')
    alunoDashboardPorDisciplina(
        @Param('alunoId') alunoId: number,
        @Param('disciplinaId') disciplinaId: number,
    ) {
        return this.dashboardService.alunoDashboardPorDisciplina(
            Number(alunoId),
            Number(disciplinaId),
        );
    }

    @Get('aluno/:alunoId/feedbacks')
    feedbacksAluno(
        @Param('alunoId', ParseIntPipe) alunoId: number,
    ) {
        return this.dashboardService.feedbacksAluno(alunoId);
    }

    @Get('professor/:professorId')
    dashboardProfessor(
        @Param('professorId') professorId: number,
    ): Promise<ProfessorDashboard> {
        return this.dashboardService.dashboardProfessor(professorId);
    }

    @Get('professor/:professorId/medias')
    mediasProfessor(@Param('professorId') professorId: number) {
        return this.dashboardService.mediasTurmasProfessor(Number(professorId));
    }

    @Get('professor/turmas/medias')
    async mediaTurmaPorDisciplina() {
        return this.dashboardService.mediaTurmaPorDisciplina();
    }

    @Get('media-turma/:professorId')
    async mediaTurma(@Param('professorId') professorId: number) {
        return this.dashboardService.mediaTurma(Number(professorId));
    }

    @Get('professor/:professorId/turma/:turmaId/periodo/:periodo')
    desempenhoProfessor(
        @Param('professorId') professorId: number,
        @Param('turmaId') turmaId: number,
        @Param('periodo') periodo: string
    ) {
        return this.dashboardService.desempenhoTurmaProfessor(
            Number(professorId),
            Number(turmaId),
            periodo
        );
    }

    @Get('professor/:professorId/feedbacks')
    feedbacksProfessor(
        @Param('professorId', ParseIntPipe) professorId: number,
    ) {
        return this.dashboardService.feedbacksProfessor(professorId);
    }

    @Get('professor/turmas/alunos')
    async totalAlunosPorTurma() {
        return this.dashboardService.totalAlunosPorTurma();
    }

}
