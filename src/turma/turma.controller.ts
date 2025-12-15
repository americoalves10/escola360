import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, Delete, Param } from '@nestjs/common';
import { TurmaDto } from './dto/turma.dto';
import { Turma } from './entity/turma.entity';
import { TurmaService } from './turma.service';

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

   @Post('registro') // /registro
   async create(@Body() createUserDto: TurmaDto){
       return this.turmaService.create(createUserDto);
   }

   @Get()
   findAll(): Promise<Turma[]> {
       return this.turmaService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: number): Promise<Turma>{
       return this.turmaService.findOne(id);
   }
   
//    @Patch(':id')
//    update(@Param('id') id: number, @Body() updateDto: TurmaDto): Promise<Turma>{
//        return this.turmaService.update(id, updateDto);
//    }

//    @Delete(':id')
//    @HttpCode(204)
//    remove(@Param('id') id: number): Promise<void> {
//        return this.turmaService.remove(id);
//    }

}