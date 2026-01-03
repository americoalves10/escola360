import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { RespostaAluno } from './entityes/resposta-aluno.entity';
import { Questao, TipoQuestao } from './entityes/questao.entity';
import { Alternativa } from './entityes/alternativa.entity';
import { ResponderQuestaoDto } from './dtos/responde-questao.dto';
import { ResponderQuestaoDiscursivaDto } from './dtos/responder-questao-discursiva.dto';

@Injectable()
export class RespostaAlunoService {
  constructor(
    @InjectRepository(RespostaAluno)
    private readonly repo: Repository<RespostaAluno>,

    @InjectRepository(Questao)
    private readonly questaoRepo: Repository<Questao>,

    @InjectRepository(Alternativa)
    private readonly altRepo: Repository<Alternativa>,
  ) { }

  async responder(alunoId: number, dto: ResponderQuestaoDto) {
    const questao = await this.questaoRepo.findOne({
      where: { id: dto.questaoId },
    });

    if (!questao) {
      throw new NotFoundException('Questão não encontrada');
    }

    let correta: boolean | null = null;
    let nota: number | null = null;
    let alternativa: Alternativa | null = null;

    if (questao.tipo !== TipoQuestao.DISCURSIVA) {
      if (!dto.alternativaId) {
        throw new NotFoundException('Alternativa obrigatória');
      }

      alternativa = await this.altRepo.findOne({
        where: { id: dto.alternativaId },
      });

      if (!alternativa) {
        throw new NotFoundException('Alternativa não encontrada');
      }

      correta = alternativa.correta;
      nota = correta ? questao.valor : 0;
    }

    const resposta = this.repo.create({
      aluno: { id: alunoId },
      questao: { id: questao.id },
      alternativa: alternativa ? { id: alternativa.id } : null,
      correta,
      nota,
    } as unknown as RespostaAluno);

    return this.repo.save(resposta);

  }

  async responderDiscursiva(
    alunoId: number,
    dto: ResponderQuestaoDiscursivaDto,
  ) {
    const questao = await this.questaoRepo.findOne({
      where: { id: dto.questaoId },
    });

    if (!questao) {
      throw new NotFoundException('Questão não encontrada');
    }

    if (questao.tipo !== TipoQuestao.DISCURSIVA) {
      throw new Error('Questão não é discursiva');
    }

    const resposta = await this.repo.save({
      aluno: { id: alunoId },
      questao: { id: questao.id },
      respostaTexto: dto.respostaTexto,
      correta: null,
      nota: null,
    });

    return this.repo.findOne({
      where: { id: resposta.id },
    });
  }

  async corrigirDiscursiva(
    respostaId: number,
    nota: number,
  ) {
    const resposta = await this.repo.findOne({
      where: { id: respostaId },
      relations: ['questao'],
    });

    if (!resposta) {
      throw new NotFoundException('Resposta não encontrada');
    }

    if (resposta.questao.tipo !== TipoQuestao.DISCURSIVA) {
      throw new Error('Resposta não é discursiva');
    }

    if (nota < 0 || nota > resposta.questao.valor) {
      throw new Error(
        `Nota inválida. Valor máximo: ${resposta.questao.valor}`,
      );
    }
    resposta.nota = nota;
    return this.repo.save(resposta);
  }

}
