import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialDidatico } from './entity/material-didatico.entity';
import { MaterialDidaticoService } from './material-didatico.service';
import { MaterialDidaticoController } from './material-didatico.controller';
import { MaterialDidaticoUploadController } from './material-didatico-upload.controller';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Turma } from 'src/turma/entity/turma.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialDidatico,
      Disciplina,
      Turma,
    ]),
  ],
  controllers: [
    MaterialDidaticoController,
    MaterialDidaticoUploadController, // 🔥 ESTE É O PONTO CRÍTICO
  ],
  providers: [MaterialDidaticoService],
})
export class MaterialDidaticoModule {}
