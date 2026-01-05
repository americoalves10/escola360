import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param, ValidationPipe } from '@nestjs/common';
import { AdministrativoService } from './administrativo.service';
import { UserDto } from './dto/administrativo.dto';
import { Useradm } from './entity/administrativo.entity';

@Controller('administrativo')
export class AdministrativoController {
  constructor(private readonly admnistrativoService: AdministrativoService) {}

   @Post('registro') // /registro
   async create(@Body() createUserDto: UserDto){
       return this.admnistrativoService.create(createUserDto);
   }

   @Get()
   findAll(): Promise<Useradm[]> {
       return this.admnistrativoService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: number): Promise<Useradm>{
       return this.admnistrativoService.findOne(id);
   }

    @Patch(':id')
    update(
    @Param('id') id: number, 
    @Body(new ValidationPipe({ skipMissingProperties: true }))
        body: UserDto, 
    ): Promise<Useradm> {
            return this.admnistrativoService.update(id, body);
    }  

   @HttpCode(HttpStatus.OK)
   @Post('login')
   async login(@Body() loginDto:UserDto){
       return this.admnistrativoService.login(loginDto);
   }

//    Nesse endpoint, apenas é para a senha, mas mudando o trecho do retorno ele pode ser colocado nos outros perfils de usuário(não tenho certeza);
    @Patch(':id/password')
    changePassword(
        @Param('id') id: number,
        @Body() body: { senhaAtual: string; novaSenha: string }
    ) {
        return this.admnistrativoService.changePassword(id, body);
    }

}

