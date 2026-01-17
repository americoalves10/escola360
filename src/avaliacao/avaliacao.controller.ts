import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    Post,
    Headers,
    Patch,
    UploadedFile,
    UseInterceptors,
    Res,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import type { Response } from 'express';


@Controller('avaliacao')
export class AvaliacaoController {
    constructor(private readonly service: AvaliacaoService) { }

    @Post('professor')
    @UseInterceptors(
        FileInterceptor('ficheiro', {
            storage: diskStorage({
                destination: './uploads/avaliacoes',
                filename: (req, file, cb) => {
                    const uniqueName =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);

                    cb(
                        null,
                        `avaliacao-${uniqueName}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
    )
    create(
        @Body() dto: CreateAvaliacaoDto,
        @UploadedFile() file: Express.Multer.File,
        @Headers('professor-id') professorId: number,
    ) {
        if (!professorId) {
            throw new ForbiddenException('Professor não identificado');
        }

        return this.service.create(
            dto,
            Number(professorId),
            file,
        );
    }

    @Get('professor')
    listarDoProfessor(
        @Headers('professor-id') professorId: number,
    ) {
        if (!professorId) {
            throw new ForbiddenException('Professor não identificado');
        }

        return this.service.findByProfessor(Number(professorId));
    }

    @Get('aluno/:avaliacaoId/download')
    async downloadAvaliacao(
        @Param('avaliacaoId') avaliacaoId: number,
        @Headers('alunoId') alunoId: number,
        @Res() res: Response,
    ) {
        if (!alunoId) {
            throw new ForbiddenException('Aluno não identificado');
        }

        const caminho = await this.service.findForAlunoDownload(
            Number(avaliacaoId),
            Number(alunoId),
        );

        return res.download(caminho);
    }



    @Patch('professor/:id')
    updateAvaliacao(
        @Param('id') id: number,
        @Body() dto: UpdateAvaliacaoDto,
        @Headers('professor-id') professorId: number,
    ) {
        if (!professorId) {
            throw new ForbiddenException('Professor não identificado');
        }

        return this.service.update(
            Number(id),
            Number(professorId),
            dto,
        );
    }
}
