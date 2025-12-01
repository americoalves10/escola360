import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { UserDto } from './dto/aluno.dto';
import { User } from './entity/aluno.entity';


@Controller('aluno') // /user
export class AlunoController {


   constructor(private readonly alunoService: AlunoService){}


   @Post() // /registro
   async create(@Body() createUserDto: UserDto){
       return this.alunoService.create(createUserDto);
   }

   @Get()
   findAll(): Promise<User[]> {
       return this.alunoService.findAll();
   }

   @Get(':matricula')
   findOne(@Param('matricula') matricula: string): Promise<User>{
       return this.alunoService.findOne(matricula);
   }

   @Patch(':matricula')
   update(@Param('matricula') matricula: string, @Body() updateDto: UserDto): Promise<User>{
       return this.alunoService.update(matricula, updateDto);
   }

   @Delete(':matricula')
   @HttpCode(204)
   remove(@Param('matricula') matricula: string): Promise<void> {
       return this.alunoService.remove(matricula);
   }

   @HttpCode(HttpStatus.OK)
   @Post('login')
   async login(@Body() loginDto:UserDto){
       return this.alunoService.login(loginDto);
   }

}
