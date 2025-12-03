import { Module } from '@nestjs/common';
import { AdministrativoService } from './administrativo.service';
import { AdministrativoController } from './administrativo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Useradm } from './entity/administrativo.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
 imports: [TypeOrmModule.forFeature([Useradm]),
 JwtModule.registerAsync({
   imports: [ConfigModule],
   inject: [ConfigService],
   useFactory: (configService: ConfigService) => ({
     secret: configService.get<string>('JWT_SECRET'),
     signOptions: {expiresIn: '1h'}
   })
 })
],
  controllers: [AdministrativoController],
  providers: [AdministrativoService],
})
export class AdministrativoModule {}
