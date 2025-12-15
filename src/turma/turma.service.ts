import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Turma } from './entity/turma.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TurmaDto } from './dto/turma.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TurmaService {

   constructor(
       @InjectRepository(Turma) private userRepository: Repository<Turma>,
       private jwtService: JwtService
   ){}

   create(dto: TurmaDto): Promise<Turma> {
    const turma = this.userRepository.create(dto);
    return this.userRepository.save(turma);
  }

   findAll(): Promise<Turma[]>{
       return this.userRepository.find();
   }

   async findOne(id: number): Promise<Turma> {
    const turma = await this.userRepository.findOneBy({ id });
    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }
    return turma;
  }


//    async update(id: number, updateData: TurmaDto): Promise<Turma> {
//       const user = await this.findOne(id);
//       const allowedFields = ["nome", "turno", "id_aluno", "id_professor", "id_disciplina"];
      
//       const sanitizedData: any = {};

//       // Garante que não entram campos inesperados
//       for (const key of Object.keys(updateData)) {
//         if (allowedFields.includes(key)) {sanitizedData[key] = updateData[key];}
//       }
//       this.userRepository.merge(user, sanitizedData);
//       return this.userRepository.save(user);
//    }

//    async remove(id: number): Promise<void> {
//       const result = await this.userRepository.delete(id);
//       if(result.affected === 0){
//           throw new NotFoundException(`Aluno com o id ${id} não encontrado para excluir.`)
//       }
//    }
   
}
