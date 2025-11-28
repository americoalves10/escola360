import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entity/aluno.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/aluno.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';




@Injectable()

export class AlunoService {


   constructor(
       @InjectRepository(User) private userRepository: Repository<User>,
       private jwtService: JwtService
   ){}

   async create(CreateUserDto: UserDto): Promise<User>{
       const {matricula, nome, cpf, dataNasc, status, email, password} = CreateUserDto;

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
            dataNasc,
            status,
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
