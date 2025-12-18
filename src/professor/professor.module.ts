import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entity/professor.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
imports: [TypeOrmModule.forFeature([Professor]),
 JwtModule.registerAsync({
   imports: [ConfigModule],
   inject: [ConfigService],
   useFactory: (configService: ConfigService) => ({
     secret: configService.get<string>('JWT_SECRET'),
     signOptions: {expiresIn: '1h'}
   })
 })
],  
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}
