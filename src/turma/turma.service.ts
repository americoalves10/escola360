import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Turma } from './entity/turma.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaDto } from './dto/turma.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TurmaService {

  constructor(
    @InjectRepository(Turma) private turmaRepository: Repository<Turma>,
    private jwtService: JwtService
  ) { }

  create(dto: TurmaDto): Promise<Turma> {
    const turma = this.turmaRepository.create(dto);
    return this.turmaRepository.save(turma);
  }

  findAll(): Promise<Turma[]> {
    return this.turmaRepository.find();
  }

  async findOne(id: number): Promise<Turma> {
    const turma = await this.turmaRepository.findOneBy({ id });
    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }
    return turma;
  }

  async update(id: number, dto: TurmaDto): Promise<Turma> {
    const turma = await this.findOne(id);

    if (id) {
      const turma = await this.turmaRepository.findOne({
        where: { id: id },
      });
      if (!turma) {
        throw new NotFoundException('Turma não encontrada.');
      }
      turma.id = id;
    }

    turma.nome = dto.nome ?? turma.nome;
    turma.turno = dto.turno ?? turma.turno;


    return this.turmaRepository.save(turma);
  }
}