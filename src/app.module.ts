import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunoModule } from './aluno/aluno.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AdministrativoModule } from './administrativo/administrativo.module';
import { ProfessorModule } from './professor/professor.module';
import { LoginModule } from './login/login.module';
import { TurmaModule } from './turma/turma.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { TurmaProfessorDisciplinaModule } from './turma-professor-disciplina/turma-professor-disciplina.module';
import { MatriculaModule } from './matricula/matricula.module';
import { MatriculaDisciplinaModule } from './matricula-disciplina/matricula-disciplina.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';

@Module({
 imports: [
   ConfigModule.forRoot({
     isGlobal: true,
   }),
   TypeOrmModule.forRootAsync({
     imports:[ConfigModule],
     useFactory:(configService: ConfigService) => ({
       type:'mysql',
       host:configService.get<string>('MYSQL_DB_HOST'),
       port:configService.get<number>('MYQSL_DB_PORT'),
       username:configService.get<string>('MYSQL_DB_USERNAME'),
       password:configService.get<string>('MYSQL_DB_PASSWORD'),
       database:configService.get<string>('MYSQL_DB_DATABASE'),


       entities:[__dirname + '/**/*.entity{.ts,.js}'],
       synchronize:true,
     }),
     inject:[ConfigService],
   }),
   AlunoModule,
   AdministrativoModule,
   ProfessorModule,
   LoginModule,
   TurmaModule,
   DisciplinaModule,
   TurmaProfessorDisciplinaModule,
   MatriculaModule,
   MatriculaDisciplinaModule,
   AvaliacaoModule,
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}