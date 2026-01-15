import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DisciplinaMatricula } from './dto/matriculaDisciplina.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Matricula } from 'src/matricula/entity/matricula.entity';
import { Repository } from 'typeorm';
import { TurmaProfessorDisciplina } from 'src/turma-professor-disciplina/entity/turmaProfessorDisciplina.entity';
import { MatriculaDisciplina } from './entity/matriculaDisciplina.entity';

@Injectable()
export class MatriculaDisciplinaService {
    constructor(
        @InjectRepository(Matricula)
        private readonly matriculaRepo: Repository<Matricula>,

        @InjectRepository(TurmaProfessorDisciplina)
        private readonly tpdRepo: Repository<TurmaProfessorDisciplina>,

        @InjectRepository(MatriculaDisciplina)
        private readonly repo: Repository<MatriculaDisciplina>,
    ) { }

    async adicionar(dto: DisciplinaMatricula) {

        const matricula = await this.matriculaRepo.findOne({
            where: { id: dto.matriculaId },
            relations: ['turma'],
        });

        if (!matricula) {
            throw new NotFoundException('Matrícula não encontrada');
        }

        // BLOQUEIO REAL
        const oferta = await this.tpdRepo.findOne({
            where: {
                id: dto.turmaProfessorDisciplinaId,
                turma: { id: matricula.turma.id },
            },
            relations: ['turma'],
        });

        if (!oferta) {
            throw new BadRequestException(
                'Oferta não pertence à turma da matrícula',
            );
        }

        const jaExiste = await this.repo.findOne({
            where: {
                matricula: { id: matricula.id },
                turmaProfessorDisciplina: { id: oferta.id },
            },
        });

        if (jaExiste) {
            throw new BadRequestException('Disciplina já adicionada');
        }

        const md = this.repo.create({
            matricula,
            turmaProfessorDisciplina: oferta,
        });

        return this.repo.save(md);
    }   

    listar() {
    return this.repo.find({
        relations: [
            'matricula',
            'matricula.aluno',
            'matricula.turma',
            'turmaProfessorDisciplina',
            'turmaProfessorDisciplina.professor',
            'turmaProfessorDisciplina.disciplina',
        ],
    });
}


}
