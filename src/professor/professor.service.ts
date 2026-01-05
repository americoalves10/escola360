import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Professor } from './entity/professor.entity';
import { ProfessorDto } from './dto/professor.dto';
import { Turma } from 'src/turma/entity/turma.entity';

@Injectable()
export class ProfessorService {

  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,

    private readonly jwtService: JwtService,
  ) { }

  async create(dto: ProfessorDto): Promise<Professor> {
    const senhaHash = await bcrypt.hash(dto.password, 10);
    const professor = this.professorRepository.create({
      matricula: dto.matricula,
      nome: dto.nome,
      cpf: dto.cpf,
      dataAdmissao: dto.dataAdmissao,
      status: dto.status,
      formacaoAcad: dto.formacaoAcad,
      titulacao: dto.titulacao,
      deficiencia: dto.deficiencia,
      tipoDeficiencia: dto.tipoDeficiencia,
      email: dto.email,
      password: senhaHash,

    });

    try {
      return await this.professorRepository.save(professor);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o professor.',
      );
    }
  }

  findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }


  async findOne(id: number): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id },
    });

    if (!professor) {
      throw new NotFoundException(
        `Professor com ID ${id} não encontrado.`,
      );
    }

    return professor;
  }

  async update(id: number, dto: ProfessorDto): Promise<Professor> {
    const professor = await this.findOne(id);
    professor.nome = dto.nome ?? professor.nome;
    professor.cpf = dto.cpf ?? professor.cpf;
    professor.dataAdmissao = dto.dataAdmissao ?? professor.dataAdmissao;
    professor.status = dto.status ?? professor.status;
    professor.formacaoAcad = dto.formacaoAcad ?? professor.formacaoAcad;
    professor.titulacao = dto.titulacao ?? professor.titulacao;
    professor.deficiencia = dto.deficiencia ?? professor.deficiencia;
    professor.tipoDeficiencia = dto.tipoDeficiencia ?? professor.tipoDeficiencia;
    professor.email = dto.email ?? professor.email;

    if (dto.password) {
      professor.password = await bcrypt.hash(dto.password, 10);
    }

    return this.professorRepository.save(professor);
  }

  //    esse é o responsável por subistituir a senha hash cadastradas no banco por uma nova, tbm segue o mesmo princípio da outra para os outrs perfis;
  async changePassword(id: number, data: { senhaAtual: string; novaSenha: string }) {
    const user = await this.findOne(id);

    const senhaValida = await bcrypt.compare(data.senhaAtual, user.password);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    user.password = await bcrypt.hash(data.novaSenha, 10);
    return this.professorRepository.save(user);
  }

  async updateStatus(id: number, status: string): Promise<Professor> {
    const user = await this.findOne(id);

    user.status = status;

    try {
      return await this.professorRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar status do professor.',
      );
    }
  }

  async login(dto: ProfessorDto): Promise<{ access_token: string }> {

    const professor = await this.professorRepository.findOne({
      where: { email: dto.email },
    });

    if (!professor) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const senhaConfere = await bcrypt.compare(
      dto.password,
      professor.password,
    );

    if (!senhaConfere) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: professor.id,
      email: professor.email,
      role: 'professor',
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}