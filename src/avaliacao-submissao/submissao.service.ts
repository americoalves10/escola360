import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubmissaoAvaliacao } from "./entity/submissao-avaliacao.entity";
import { Repository } from "typeorm";
import { Avaliacao } from "src/avaliacao/entity/avaliacao.entity";
import { Matricula } from "src/matricula/entity/matricula.entity";
import { CreateSubmissaoAvaliacaoDto } from "./dto/create-submissao-avaliacao.dto";
import { CorrigirSubmissaoDto } from "./dto/corrigir-submissao.dto";
import PDFDocument from 'pdfkit';
import { Writable } from 'stream';

@Injectable()
export class SubmissaoAvaliacaoService {
    constructor(
        @InjectRepository(SubmissaoAvaliacao)
        private repo: Repository<SubmissaoAvaliacao>,

        @InjectRepository(Avaliacao)
        private avaliacaoRepo: Repository<Avaliacao>,

        @InjectRepository(Matricula)
        private matriculaRepo: Repository<Matricula>,
    ) { }

    async submeter(
        dto: CreateSubmissaoAvaliacaoDto,
        alunoId: number,
        file: Express.Multer.File,
    ) {
        const avaliacao = await this.avaliacaoRepo.findOne({
            where: { id: dto.avaliacaoId },
            relations: ['turma', 'disciplina'],
        });

        if (!avaliacao) {
            throw new NotFoundException('Avaliação não encontrada');
        }

        const matricula = await this.matriculaRepo.findOne({
            where: {
                aluno: { id: alunoId },
                turma: { id: avaliacao.turma.id },
            },
        });

        if (!matricula) {
            throw new ForbiddenException('Aluno não pertence à turma');
        }

        const jaSubmeteu = await this.repo.findOne({
            where: {
                avaliacao: { id: avaliacao.id },
                aluno: { id: alunoId },
            },
        });

        if (jaSubmeteu) {
            throw new ForbiddenException('Avaliação já submetida');
        }

        if (!file) {
            throw new ForbiddenException('Arquivo da submissão é obrigatório');
        }

        const submissao = this.repo.create({
            avaliacao,
            aluno: { id: alunoId },
            turma: avaliacao.turma,
            disciplina: avaliacao.disciplina,
            ficheiroResposta: `/uploads/submissoes/${file.filename}`,
        });

        return this.repo.save(submissao);
    }

    async corrigirSubmissao(
        submissaoId: number,
        professorId: number,
        dto: CorrigirSubmissaoDto,
    ) {
        const submissao = await this.repo.findOne({
            where: { id: submissaoId },
            relations: [
                'avaliacao',
                'avaliacao.professor',
            ],
        });

        if (!submissao) {
            throw new NotFoundException('Submissão não encontrada');
        }

        // 🔐 só o professor da avaliação
        if (submissao.avaliacao.professor.id !== professorId) {
            throw new ForbiddenException('Sem permissão para corrigir esta submissão');
        }

        // ⛔ não corrigir duas vezes
        if (submissao.estado === 'CORRIGIDO') {
            throw new ForbiddenException('Submissão já foi corrigida');
        }

        submissao.nota = dto.nota;
        submissao.pontosFortes = dto.pontosFortes ?? null;
        submissao.pontosMelhorar = dto.pontosMelhorar ?? null;
        submissao.estado = 'CORRIGIDO';

        return this.repo.save(submissao);
    }


    async listarPorAvaliacao(avaliacaoId: number, professorId: number) {
        const avaliacao = await this.avaliacaoRepo.findOne({
            where: { id: avaliacaoId },
            relations: ['professor'],
        });

        if (!avaliacao) {
            throw new NotFoundException('Avaliação não encontrada');
        }

        if (avaliacao.professor.id !== professorId) {
            throw new ForbiddenException('Sem permissão para esta avaliação');
        }

        return this.repo.find({
            where: {
                avaliacao: { id: avaliacaoId },
            },
            relations: ['aluno'],
        });
    }

    async downloadSubmissaoProfessor(
        submissaoId: number,
        professorId: number,
    ) {
        const submissao = await this.repo.findOne({
            where: { id: submissaoId },
            relations: [
                'avaliacao',
                'avaliacao.professor',
            ],
        });

        if (!submissao) {
            throw new NotFoundException('Submissão não encontrada');
        }

        if (submissao.avaliacao.professor.id !== professorId) {
            throw new ForbiddenException('Sem permissão para esta submissão');
        }

        return submissao.ficheiroResposta;
    }

    async listarSubmissoesAluno(alunoId: number) {
        return this.repo.find({
            where: {
                aluno: { id: alunoId },
                estado: 'CORRIGIDO',
            },
            relations: [
                'avaliacao',
                'disciplina',
            ],
            order: {
                dataSubmissao: 'DESC',
            },
            select: {
                id: true,
                nota: true,
                pontosFortes: true,
                pontosMelhorar: true,
                estado: true,
                dataSubmissao: true,
            },
        });
    }

    async calcularMediaPorDisciplina(
        alunoId: number,
        disciplinaId: number,
    ) {
        const result = await this.repo
            .createQueryBuilder('s')
            .select('ROUND(AVG(s.nota), 1)', 'media')
            .where('s.aluno.id = :alunoId', { alunoId })
            .andWhere('s.disciplina.id = :disciplinaId', { disciplinaId })
            .andWhere('s.estado = :estado', { estado: 'CORRIGIDO' })
            .getRawOne();

        const media = Number(result?.media ?? 0);

        return {
            media,
            situacao: media >= 7 ? 'APROVADO' : 'REPROVADO',
        };
    }

    async gerarBoletimAluno(alunoId: number) {
        const submissoes = await this.repo.find({
            where: {
                aluno: { id: alunoId },
                estado: 'CORRIGIDO',
            },
            relations: [
                'avaliacao',
                'avaliacao.disciplina',
            ],
        });

        if (!submissoes.length) {
            throw new NotFoundException('Aluno sem avaliações corrigidas');
        }

        const disciplinasMap = new Map<number, any>();

        for (const s of submissoes) {
            const disc = s.avaliacao.disciplina;

            if (!disciplinasMap.has(disc.id)) {
                disciplinasMap.set(disc.id, {
                    disciplina: disc.nome,
                    avaliacoes: [],
                    media: 0,
                    situacao: 'REPROVADO',
                });
            }

            disciplinasMap.get(disc.id).avaliacoes.push({
                titulo: s.avaliacao.titulo,
                nota: s.nota,
            });
        }

        // calcular médias
        let somaGeral = 0;

        disciplinasMap.forEach((d) => {
            const total = d.avaliacoes.reduce(
                (sum, a) => sum + a.nota,
                0,
            );

            d.media = Number(
                (total / d.avaliacoes.length).toFixed(1),
            );

            d.situacao = d.media >= 7 ? 'APROVADO' : 'REPROVADO';

            somaGeral += d.media;
        });

        const mediaGeral = Number(
            (somaGeral / disciplinasMap.size).toFixed(1),
        );

        return {
            disciplinas: Array.from(disciplinasMap.values()),
            mediaGeral,
            situacaoGeral:
                mediaGeral >= 7 ? 'APROVADO' : 'REPROVADO',
        };
    }

    async gerarBoletimPdf(alunoId: number): Promise<Buffer> {
        const boletim = await this.gerarBoletimAluno(alunoId);

        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            doc.on('error', reject);

            doc
                .fontSize(18)
                .text('Boletim Escolar', { align: 'center' })
                .moveDown(2);

            doc.fontSize(12).text(`Aluno ID: ${alunoId}`);
            doc.moveDown();

            boletim.disciplinas.forEach((d) => {
                doc
                    .fontSize(14)
                    .text(d.disciplina, { underline: true })
                    .moveDown(0.5);

                d.avaliacoes.forEach((a) => {
                    doc
                        .fontSize(11)
                        .text(`• ${a.titulo}: ${a.nota}`);
                });

                doc
                    .moveDown(0.3)
                    .fontSize(12)
                    .text(`Média: ${d.media}`)
                    .text(`Situação: ${d.situacao}`)
                    .moveDown();
            });

            doc
                .moveDown()
                .fontSize(14)
                .text(`Média Geral: ${boletim.mediaGeral}`)
                .text(`Situação Final: ${boletim.situacaoGeral}`);

            doc.end();
        });
    }

}