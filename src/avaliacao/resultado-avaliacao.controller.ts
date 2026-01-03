import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ResultadoAvaliacaoService } from './resultado-avaliacao.service';

@Controller('resultados')
export class ResultadoAvaliacaoController {
    constructor(private service: ResultadoAvaliacaoService) { }

    @Post('finalizar/:avaliacaoId/:alunoId')
    finalizar(
        @Param('avaliacaoId') avaliacaoId: number,
        @Param('alunoId') alunoId: number,
    ) {
        return this.service.finalizar(Number(alunoId), Number(avaliacaoId));
    }
}


