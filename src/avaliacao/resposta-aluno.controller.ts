import { Body, Controller, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RespostaAlunoService } from "./resposta-aluno.service";
import { ResponderQuestaoDto } from "./dtos/responde-questao.dto";
import { CorrigirDiscursivaDto } from "./dtos/corrige-discursiva.dto";
import { ResponderQuestaoDiscursivaDto } from "./dtos/responder-questao-discursiva.dto";

@Controller('respostas')
export class RespostaAlunoController {
  constructor(private readonly service: RespostaAlunoService) { }

  // ✅ PRIMEIRO a rota específica
  @Post('discursiva/:alunoId')
  responderDiscursiva(
    @Param('alunoId', ParseIntPipe) alunoId: number,
    @Body() dto: ResponderQuestaoDiscursivaDto,
  ) {
    return this.service.responderDiscursiva(alunoId, dto);
  }

  // ✅ DEPOIS a rota genérica
  @Post(':alunoId')
  responder(
    @Param('alunoId', ParseIntPipe) alunoId: number,
    @Body() dto: ResponderQuestaoDto,
  ) {
    return this.service.responder(alunoId, dto);
  }



  // professor corrige discursiva
  @Patch('corrigir/:respostaId')
  corrigirDiscursiva(
    @Param('respostaId', ParseIntPipe) respostaId: number,
    @Body() dto: CorrigirDiscursivaDto,
  ) {
    return this.service.corrigirDiscursiva(respostaId, dto.nota);
  }

}

