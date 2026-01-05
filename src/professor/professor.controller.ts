import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorDto } from './dto/professor.dto';
import { Professor } from './entity/professor.entity';

@Controller('professor')
export class ProfessorController {
    constructor(private readonly professorService: ProfessorService) { }

    @Post('registro') // /registro
    async create(@Body() createUserDto: ProfessorDto) {
        return this.professorService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<Professor[]> {
        return this.professorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Professor> {
        return this.professorService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateDto: ProfessorDto): Promise<Professor> {
        return this.professorService.update(id, updateDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: ProfessorDto) {
        return this.professorService.login(loginDto);
    }

    //    Nesse endpoint, apenas é para a senha, mas mudando o trecho do retorno ele pode ser colocado nos outros perfils de usuário(não tenho certeza);
    @Patch(':id/password')
    changePassword(
        @Param('id') id: number,
        @Body() body: { senhaAtual: string; novaSenha: string }
    ) {
        return this.professorService.changePassword(id, body);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: number,
        @Body() body: { status: string }
    ): Promise<Professor> {
        return this.professorService.updateStatus(id, body.status);
    }
}
