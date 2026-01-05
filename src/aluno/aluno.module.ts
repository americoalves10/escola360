import { Module } from '@nestjs/common';
import { AlunoController } from './aluno.controller';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './entity/aluno.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Turma } from 'src/turma/entity/turma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aluno, Turma]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' }
    })
  })
  ],
  controllers: [AlunoController],
  providers: [AlunoService]
})
export class AlunoModule { }