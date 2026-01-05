import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialDidatico } from './entity/material-didatico.entity';
import { CreateMaterialDidaticoDto } from './dto/material-didatico.dto';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { Professor } from 'src/professor/entity/professor.entity';

@Injectable()
export class MaterialDidaticoService {
  constructor(
    @InjectRepository(MaterialDidatico)
    private readonly repository: Repository<MaterialDidatico>,

    @InjectRepository(Disciplina)
    private readonly disciplinaRepo: Repository<Disciplina>,

    @InjectRepository(Turma)
    private readonly turmaRepo: Repository<Turma>,

    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) { }

  // 👨‍🏫 CRIAR MATERIAL
  async create(dto: CreateMaterialDidaticoDto, professorId: number) {
    const disciplina = await this.disciplinaRepo.findOne({
      where: { id: dto.disciplinaId },
    });

    const turma = await this.turmaRepo.findOne({
      where: { id: dto.turmaId },
    });

    const professor = await this.professorRepo.findOne({
      where: { id: professorId },
    });

    if (!disciplina || !turma || !professor) {
      throw new NotFoundException(
        'Disciplina, Turma ou Professor inválido',
      );
    }

    const material = this.repository.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      tipo: dto.tipo,
      ficheiroUrl: dto.ficheiroUrl,
      linkVideo: dto.linkVideo,
      disciplina,
      turma,
      professor,
      visivel: true,
    });

    return this.repository.save(material);
  }

  async findByProfessor(turmaId: number, disciplinaId: number) {
    return this.repository.find({
      where: {
        turma: { id: turmaId },
        disciplina: { id: disciplinaId },
      },
      order: { createdAt: 'DESC' },
    });
  }
  
  // 👨‍🎓 LISTAR VISÍVEIS PARA ALUNO
  async findVisiveis(turmaId: number, disciplinaId: number) {
    return this.repository.find({
      where: {
        turma: { id: turmaId },
        disciplina: { id: disciplinaId },
        visivel: true,
      },
      relations: ['professor'],
    });
  }

  async update(id: number, dto: any) {
    await this.repository.update(id, dto);
    return this.repository.findOne({ where: { id } });
  }

  async toggleVisibilidade(id: number) {
    const material = await this.repository.findOne({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado');
    }

    material.visivel = !material.visivel;
    return this.repository.save(material);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}
