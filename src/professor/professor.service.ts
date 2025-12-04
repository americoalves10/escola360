import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Professor } from './entity/professor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/professor.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProfessorService {

   constructor(
       @InjectRepository(Professor) private userRepository: Repository<Professor>,
       private jwtService: JwtService
   ){}

   async create(CreateUserDto: UserDto): Promise<Professor>{
       const {matricula, nome, cpf, dataAdmissao, status, formacaoAcad, titulacao, email, password} = CreateUserDto;

       const userExists = await this.userRepository.findOne({where: {email}});
       if(userExists){
           throw new ConflictException('Este e-mail já está em uso.')
       }

       const salt = await bcrypt.genSalt();
       const hashedPassword = await bcrypt.hash(password, salt);

       const user = this.userRepository.create({
            matricula,
            nome,
            cpf,
            dataAdmissao,
            status,
            formacaoAcad,
            titulacao,
            email,
            password: hashedPassword,
       });

       try {
           await this.userRepository.save(user);
           return user;
       } catch (error){
           throw new InternalServerErrorException('Erro ao salvar o usuário.')
       }
   }

   findAll(): Promise<Professor[]>{
       return this.userRepository.find();
   }

   async findOne(id: number): Promise<Professor>{
       const user = await this.userRepository.findOneBy({id});
       if(!user){
           throw new NotFoundException(`Aluno com o id ${id} não encontrado.`)
       }
       return user;
   }

    async update(id: number, updateData: UserDto): Promise<Professor> {
        const user = await this.findOne(id);
        const allowedFields = ["matricula", "nome", "cpf", "dataAdmissao", "status", "formacaoAcad", "titulacao", "email", "password"];
        
        const sanitizedData: any = {};

            // Garante que não entram campos inesperados
            for (const key of Object.keys(updateData)) {
                if (allowedFields.includes(key)) {
                    sanitizedData[key] = updateData[key];
                }
            }

            // Gerir password
            if (sanitizedData.password) {
                sanitizedData.password = await bcrypt.hash(sanitizedData.password, 10);
            } else {
                delete sanitizedData.password;
            }

        this.userRepository.merge(user, sanitizedData);
        return this.userRepository.save(user);
    }

   async remove(id: number): Promise<void> {
       const result = await this.userRepository.delete(id);
       if(result.affected === 0){
           throw new NotFoundException(`Aluno com o id ${id} não encontrado para excluir.`)
       }
   }

   async login(loginDto: UserDto): Promise<{access_token:string}>{
       const {email,password} = loginDto;

       const user = await this.userRepository.findOne({where: {email}});

       if(!user){
           throw new UnauthorizedException('Credenciais inválidas');
       }

       const isPasswordMatching = await bcrypt.compare(password,user.password);

       if(!isPasswordMatching){
           throw new UnauthorizedException('Credenciais inválidas');
       }

       const payload = {
           sub: user.id,
           email: user.email
       };

       const accesstoken = await this.jwtService.signAsync(payload);

       return{
           access_token:accesstoken
       };
   }
}
