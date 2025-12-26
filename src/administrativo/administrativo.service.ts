import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Useradm } from './entity/administrativo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/administrativo.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdministrativoService {

   constructor(
       @InjectRepository(Useradm) private userRepository: Repository<Useradm>,
       private jwtService: JwtService
   ){}

    async create(CreateUserDto: UserDto): Promise<Useradm>{
       const {matricula, nome, cpf, status, dataNasc, email, password} = CreateUserDto;

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
            status,
            dataNasc,
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

    


   findAll(): Promise<Useradm[]>{
       return this.userRepository.find();
   }

   async findOne(id: number): Promise<Useradm>{
       const user = await this.userRepository.findOneBy({id});
       if(!user){
           throw new NotFoundException(`Administrativo com o ${id} não encontrado.`)
       }
       return user;
   }

    async update(id: number, updateData: UserDto): Promise<Useradm> {
        const user = await this.findOne(id);
        const allowedFields = ["matricula", "nome", "cpf", "status", "dataNasc", "email", "password"];
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
      
//    async remove(id: number): Promise<void> {
//        const result = await this.userRepository.delete(id);
//        if(result.affected === 0){
//            throw new NotFoundException(`Administrativo com o ${id} não encontrado para excluir.`)
//        }
//    }

//    esse é o responsável por subistituir a senha hash cadastradas no banco por uma nova, tbm segue o mesmo princípio da outra para os outrs perfis;
    async changePassword(id: number, data: { senhaAtual: string; novaSenha: string }) {
        const user = await this.findOne(id);

        const senhaValida = await bcrypt.compare(data.senhaAtual, user.password);
            if (!senhaValida) {
                throw new UnauthorizedException('Senha atual inválida');
            }

        user.password = await bcrypt.hash(data.novaSenha, 10);
        return this.userRepository.save(user);
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
