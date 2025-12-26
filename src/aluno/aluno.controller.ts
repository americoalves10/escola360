import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { UserDto } from './dto/aluno.dto';
import { Aluno } from './entity/aluno.entity';


@Controller('aluno') // /user
export class AlunoController {


   constructor(private readonly alunoService: AlunoService){}


   @Post('registro') // /registro
   async create(@Body() createUserDto: UserDto){
       return this.alunoService.create(createUserDto);
   }

   //informações completa de um alunos
   @Get('completo/:id')
        findAlunoCompleto(
            @Param('id') id: number
    ) {
        return this.alunoService.findAlunoCompleto(Number(id));
    }
   
   @Get()
   findAll(): Promise<Aluno[]> {
       return this.alunoService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: number): Promise<Aluno>{
       return this.alunoService.findOne(id);
   }

   @Patch(':id')
   update(@Param('id') id: number, @Body() updateDto: UserDto): Promise<Aluno>{
       return this.alunoService.update(id, updateDto);
   }


   @HttpCode(HttpStatus.OK)
   @Post('login')
   async login(@Body() loginDto:UserDto){
       return this.alunoService.login(loginDto);
   }

//    Nesse endpoint, apenas é para a senha, mas mudando o trecho do retorno ele pode ser colocado nos outros perfils de usuário(não tenho certeza);
    @Patch(':id/password')
    changePassword(
        @Param('id') id: number,
        @Body() body: { senhaAtual: string; novaSenha: string }
    ) {
        return this.alunoService.changePassword(id, body);
    }

    @Patch(':id/status')
        updateStatus(
            @Param('id') id: number,
            @Body() body: { status: string }
    ): Promise<Aluno> {
        return this.alunoService.updateStatus(id, body.status);
    } 

}   


