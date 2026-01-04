import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialDidatico } from './entity/material-didatico.entity';
import { CreateMaterialDidaticoDto } from './dto/material-didatico.dto';

@Injectable()
export class MaterialDidaticoService {
  constructor(
    @InjectRepository(MaterialDidatico)
    private readonly repository: Repository<MaterialDidatico>,
  ) {}

  async create(dto: CreateMaterialDidaticoDto) {
    const material = this.repository.create(dto);
    return this.repository.save(material);
  }

  async findByDisciplinaETurma(
    disciplinaId: number,
    turmaId: number,
  ) {
    return this.repository.find({
      where: {
        disciplina: { id: disciplinaId },
        turma: { id: turmaId },
      },
    });
  }

  async update(id: number, dto: any) {
    await this.repository.update(id, dto);
    return this.repository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}