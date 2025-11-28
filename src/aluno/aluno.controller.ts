import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { UserDto } from './dto/aluno.dto';


@Controller('aluno') // /user
export class AlunoController {


   constructor(private readonly alunoService: AlunoService){}


   @Post() // /registro
   async create(@Body() createUserDto: UserDto){
       return this.alunoService.create(createUserDto);
   }

   @HttpCode(HttpStatus.OK)
   @Post('login')
   async login(@Body() loginDto:UserDto){
       return this.alunoService.login(loginDto);
   }

}
