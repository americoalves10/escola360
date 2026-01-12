import { Controller, Get, Headers, Param, ForbiddenException } from '@nestjs/common';
import { HistoricoService } from './historico.service';

@Controller('historico')
export class HistoricoController {
  constructor(private readonly service: HistoricoService) {}

  @Get('aluno/:alunoId')
  gerarHistorico(
    @Param('alunoId') alunoId: number,
    @Headers('aluno-id') alunoLogado: number,
  ) {
    if (+alunoId !== +alunoLogado) {
      throw new ForbiddenException('Acesso negado ao histórico');
    }

    return this.service.gerarHistoricoAluno(+alunoId);
  }
}