import { Body, Controller, ForbiddenException, Post, Headers, Param, Patch, Get, Res } from "@nestjs/common";
import { SubmissaoAvaliacaoService } from "./submissao.service";
import { CreateSubmissaoAvaliacaoDto } from "./dto/create-submissao-avaliacao.dto";
import { CorrigirSubmissaoDto } from './dto/corrigir-submissao.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { join } from 'path';
import type { Response } from 'express';

@Controller('submissao-avaliacao')
export class SubmissaoAvaliacaoController {
    constructor(private readonly service: SubmissaoAvaliacaoService) { }

    @Post('aluno')
    @UseInterceptors(
        FileInterceptor('file', {
            dest: './uploads/submissoes',
        }),
    )
    submeter(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateSubmissaoAvaliacaoDto,
        @Headers('alunoId') alunoId: number,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        return this.service.submeter(dto, Number(alunoId), file);
    }

    @Patch('professor/:submissaoId/corrigir')
    corrigir(
        @Param('submissaoId') submissaoId: number,
        @Body() dto: CorrigirSubmissaoDto,
        @Headers('professor-id') professorId: number,
    ) {
        if (!professorId) {
            throw new ForbiddenException('Professor não identificado');
        }

        return this.service.corrigirSubmissao(
            Number(submissaoId),
            Number(professorId),
            dto,
        );
    }

    @Get('professor/avaliacao/:avaliacaoId')
    listarPorAvaliacao(
        @Param('avaliacaoId') avaliacaoId: number,
        @Headers('professor-id') professorId: number,
    ) {
        if (!professorId) {
            throw new ForbiddenException();
        }

        return this.service.listarPorAvaliacao(
            Number(avaliacaoId),
            Number(professorId),
        );
    }

    @Get('professor/submissao/:submissaoId/download')
    async downloadSubmissao(
        @Param('submissaoId') submissaoId: number,
        @Headers('professor-id') professorId: number,
        @Res() res: Response,
    ) {
        if (!professorId) {
            throw new ForbiddenException('Professor não identificado');
        }

        const ficheiroRelativo =
            await this.service.downloadSubmissaoProfessor(
                Number(submissaoId),
                Number(professorId),
            );

        const ficheiroAbsoluto = join(
            process.cwd(),
            ficheiroRelativo,
        );

        return res.download(ficheiroAbsoluto);
    }

    @Get('aluno')
    async listarSubmissoesAluno(
        @Headers('alunoId') alunoId: number,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        return this.service.listarSubmissoesAluno(
            Number(alunoId),
        );
    }

    @Get('aluno/media/:disciplinaId')
    async mediaPorDisciplina(
        @Param('disciplinaId') disciplinaId: number,
        @Headers('alunoId') alunoId: number,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        return this.service.calcularMediaPorDisciplina(
            Number(alunoId),
            Number(disciplinaId),
        );
    }

    @Get('aluno/boletim')
    async boletimAluno(
        @Headers('alunoId') alunoId: number,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        return this.service.gerarBoletimAluno(
            Number(alunoId),
        );
    }

    @Get('aluno/boletim/pdf')
    async boletimPdf(
        @Headers('alunoId') alunoId: number,
        @Res() res: Response,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        const pdfBuffer = await this.service.gerarBoletimPdf(
            Number(alunoId),
        );

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=boletim.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}