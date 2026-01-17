import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Avaliacao } from "./entity/avaliacao.entity";
import { Turma } from "src/turma/entity/turma.entity";
import { Disciplina } from "src/disciplina/entity/disciplina.entity";
import { Professor } from "src/professor/entity/professor.entity";
import { Repository } from "typeorm";
import { CreateAvaliacaoDto } from "./dto/create-avaliacao.dto";
import { UpdateAvaliacaoDto } from "./dto/update-avaliacao.dto";
import { join } from 'path';
import { Aluno } from "src/aluno/entity/aluno.entity";
import { Matricula } from 'src/matricula/entity/matricula.entity';

@Injectable()
export class AvaliacaoService {
    constructor(
        @InjectRepository(Avaliacao)
        private readonly repo: Repository<Avaliacao>,

        @InjectRepository(Turma)
        private turmaRepo: Repository<Turma>,

        @InjectRepository(Disciplina)
        private disciplinaRepo: Repository<Disciplina>,

        @InjectRepository(Professor)
        private professorRepo: Repository<Professor>,

        @InjectRepository(Aluno)
        private alunoRepo: Repository<Aluno>,

        @InjectRepository(Matricula)
        private matriculaRepo: Repository<Matricula>,
    ) { }

    async create(dto: CreateAvaliacaoDto, professorId: number,
        file?: Express.Multer.File,) {
        const turma = await this.turmaRepo.findOneBy({ id: dto.turmaId });
        const disciplina = await this.disciplinaRepo.findOneBy({ id: dto.disciplinaId });
        const professor = await this.professorRepo.findOneBy({ id: professorId });

        if (!turma) throw new NotFoundException('Turma não encontrada');
        if (!disciplina) throw new NotFoundException('Disciplina não encontrada');
        if (!professor) throw new NotFoundException('Professor não encontrado');

        const avaliacao = this.repo.create({
            titulo: dto.titulo,
            descricao: dto.descricao,
            periodo: dto.periodo,
            tipo: dto.tipo,
            anoLetivo: dto.anoLetivo,
            turma,
            disciplina,
            professor,
            ficheiroUrl: file
                ? `/uploads/avaliacoes/${file.filename}`
                : dto.ficheiroUrl,
        });


        return this.repo.save(avaliacao);
    }

    async findByTurmaDisciplinaParaAluno(
        turmaId: number,
        disciplinaId: number,
    ) {
        return this.repo.find({
            where: {
                turma: { id: turmaId },
                disciplina: { id: disciplinaId },
                visivelParaAluno: true,
            },
            order: { createdAt: 'ASC' },
        });
    }

    findByTurmaDisciplina(turmaId: number, disciplinaId: number) {
        return this.repo.find({
            where: {
                turma: { id: turmaId },
                disciplina: { id: disciplinaId },
            },
            order: { createdAt: 'DESC' },
        });
    }

    async findByProfessor(professorId: number) {
        return this.repo.find({
            where: {
                professor: { id: professorId },
            },
            relations: ['turma', 'disciplina'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    
    async update(
            avaliacaoId: number,
            professorId: number,
            dto: UpdateAvaliacaoDto,
        ) {
            const avaliacao = await this.repo.findOne({
                where: { id: avaliacaoId },
                relations: ['professor'],
            });

            if (!avaliacao) {
                throw new NotFoundException('Avaliação não encontrada');
            }

            if (avaliacao.professor.id !== professorId) {
                throw new ForbiddenException(
                    'Sem permissão para atualizar esta avaliação',
                );
            }

            Object.assign(avaliacao, dto);
            return this.repo.save(avaliacao);
        }

    async findForAlunoDownload(avaliacaoId: number, alunoId: number) {
            const avaliacao = await this.repo.findOne({
                where: { id: avaliacaoId },
                relations: ['turma'],
            });

            if (!avaliacao) {
                throw new NotFoundException('Avaliação não encontrada');
            }

            if (!avaliacao.visivelParaAluno) {
                throw new ForbiddenException('Avaliação não está disponível para o aluno');
            }

            if (!avaliacao.ficheiroUrl) {
                throw new NotFoundException('Arquivo da avaliação não encontrado');
            }

            const matricula = await this.matriculaRepo.findOne({
                where: {
                    aluno: { id: alunoId },
                    turma: { id: avaliacao.turma.id },
                },
                relations: ['turma'],
            });

            if (!matricula) {
                throw new ForbiddenException(
                    'Aluno não pertence à turma desta avaliação',
                );
            }

            return join(process.cwd(), avaliacao.ficheiroUrl);
        }


    }