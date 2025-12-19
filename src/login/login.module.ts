import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from 'src/aluno/entity/aluno.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Professor } from 'src/professor/entity/professor.entity';
import { Useradm } from 'src/administrativo/entity/administrativo.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Aluno, Professor, Useradm]),
   JwtModule.registerAsync({
     imports: [ConfigModule],
     inject: [ConfigService],
     useFactory: (configService: ConfigService) => ({
       secret: configService.get<string>('JWT_SECRET'),
       signOptions: {expiresIn: '1h'}
     })
   })
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
