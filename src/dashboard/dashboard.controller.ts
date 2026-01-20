// src/dashboard/dashboard.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AlunoDashboard } from './interfaces/aluno-dashboard.interface';
import { ProfessorDashboard } from './interfaces/professor-dashboard.interface';


@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

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

    @Get('professor/:professorId')
    dashboardProfessor(
        @Param('professorId') professorId: number,
    ): Promise<ProfessorDashboard> {
        return this.dashboardService.dashboardProfessor(professorId);
    }

    @Get('professor/turmas/alunos')
    async totalAlunosPorTurma() {
        return this.dashboardService.totalAlunosPorTurma();
    }

    @Get('professor/turmas/medias')
    async mediaTurmaPorDisciplina() {
        return this.dashboardService.mediaTurmaPorDisciplina();
    }
}
