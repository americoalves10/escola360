import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Useradm } from 'src/administrativo/entity/administrativo.entity';
import { User } from 'src/aluno/entity/aluno.entity';
import { Professor } from 'src/professor/entity/professor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
    constructor(
    @InjectRepository(User)
    private alunoRepo: Repository<User>,

    @InjectRepository(Professor)
    private professorRepo: Repository<Professor>,

    @InjectRepository(Useradm)
    private adminRepo: Repository<Useradm>,

    private jwtService: JwtService
  ) {}

  async login(email: string, senha: string) {
    // 1. Tenta encontrar como aluno
    const aluno = await this.alunoRepo.findOne({ where: { email } });
    if (aluno && await compare(senha, aluno.password)) {
      return {
        access_token: this.jwtService.sign({ sub: aluno.id, role: 'aluno' }),
        role: 'aluno'
      };
    }

    // 2. Tenta encontrar como professor
    const professor = await this.professorRepo.findOne({ where: { email } });
    if (professor && await compare(senha, professor.password)) {
      return {
        access_token: this.jwtService.sign({ sub: professor.id, role: 'professor' }),
        role: 'professor'
      };
    }

    // 3. Tenta como administrativo/coordenador
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (admin && await compare(senha, admin.password)) {
      return {
        access_token: this.jwtService.sign({ sub: admin.id, role: 'coordenador' }),
        role: 'coordenador'
      };
    }

    throw new UnauthorizedException('Email ou senha inválidos.');
  }
}
