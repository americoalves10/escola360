import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param } from '@nestjs/common';
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
   update(@Param('id') id: number, @Body() updateDto: UserDto): Promise<Useradm>{
       return this.admnistrativoService.update(id, updateDto);
   }

   @Delete(':id')
   @HttpCode(204)
   remove(@Param('id') id: number): Promise<void> {
       return this.admnistrativoService.remove(id);
   }

   @HttpCode(HttpStatus.OK)
   @Post('login')
   async login(@Body() loginDto:UserDto){
       return this.admnistrativoService.login(loginDto);
   }

}
