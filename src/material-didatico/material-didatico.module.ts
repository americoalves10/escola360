import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialDidatico } from './entity/material-didatico.entity';
import { MaterialDidaticoService } from './material-didatico.service';
import { MaterialDidaticoController } from './material-didatico.controller';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { MaterialDidaticoUploadController } from './material-didatico-upload.controller';
import { Professor } from 'src/professor/entity/professor.entity';
import { Matricula } from 'src/matricula/entity/matricula.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialDidatico,
      Disciplina,
      Turma,
      Professor,
      Matricula,
    ]),
  ],
  controllers: [
    MaterialDidaticoController,
    MaterialDidaticoUploadController,
  ],
  providers: [MaterialDidaticoService],
})
export class MaterialDidaticoModule { }

