import { Module } from '@nestjs/common';
import { TurmaProfessorDisciplinaService } from './turma-professor-disciplina.service';
import { TurmaProfessorDisciplinaController } from './turma-professor-disciplina.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurmaProfessorDisciplina } from './entity/turmaProfessorDisciplina.entity';
import { Professor } from 'src/professor/entity/professor.entity';
import { Turma } from 'src/turma/entity/turma.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Disciplina } from 'src/disciplina/entity/disciplina.entity';

@Module({
imports: [TypeOrmModule.forFeature([TurmaProfessorDisciplina, Professor, Turma, Disciplina]),
 JwtModule.registerAsync({
   imports: [ConfigModule],
   inject: [ConfigService],
   useFactory: (configService: ConfigService) => ({
     secret: configService.get<string>('JWT_SECRET'),
     signOptions: {expiresIn: '1h'}
   })
 })
],  
  controllers: [TurmaProfessorDisciplinaController],
  providers: [TurmaProfessorDisciplinaService],
})
export class TurmaProfessorDisciplinaModule {}
