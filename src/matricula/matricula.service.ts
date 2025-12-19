import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Matricula } from "./entity/matricula.entity";
import { Aluno } from "src/aluno/entity/aluno.entity"; // Importando a nova classe Aluno
import { Turma } from "src/turma/entity/turma.entity";
import { MatriculaDto } from "./dto/matricula.dto";

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private repo: Repository<Matricula>,

    @InjectRepository(Aluno) // Usando o repositório correto
    private alunoRepo: Repository<Aluno>,

    @InjectRepository(Turma)
    private turmaRepo: Repository<Turma>,
  ) {}

  async criar(dto: MatriculaDto) {

    const aluno = await this.alunoRepo.findOneBy({ id: Number(dto.alunoId) });
    const turma = await this.turmaRepo.findOneBy({ id: Number(dto.turmaId) });

    if (!aluno || !turma) {
      throw new NotFoundException('Aluno ou turma não encontrados');
    }

    const jaExiste = await this.repo.findOne({
        where: { 
          aluno: { id: aluno.id }, 
          turma: { id: turma.id },
          anoLetivo: dto.anoLetivo 
        }
    });

    if (jaExiste) {
         throw new BadRequestException('Este aluno já está matriculado nesta turma para este ano letivo.');
    }

    // Usando os IDs diretamente ou os objetos
    const matricula = this.repo.create({ 
         aluno, 
         turma, 
         anoLetivo: dto.anoLetivo 
    });

      return this.repo.save(matricula);
  }

  listar() {
      return this.repo.find({
        relations: ['aluno', 'turma'],
      });
  }
}

// // 1. LOG DE ENTRADA: Verifica se o Nest recebeu os IDs do Postman corretamente
//     console.log('--- DIAGNÓSTICO DE MATRÍCULA ---');
//     console.log('DTO recebido:', dto);
//     console.log('Tipo de alunoId:', typeof dto.alunoId); // Deve ser number ou string

//     // 2. BUSCA MANUAL: Tenta buscar pelo ID convertido
//     const idAluno = Number(dto.alunoId);
//     const idTurma = Number(dto.turmaId);

//     const aluno = await this.alunoRepo.findOne({ where: { id: idAluno } });
//     const turma = await this.turmaRepo.findOne({ where: { id: idTurma } });

//     console.log('Resultado Aluno:', aluno ? `Encontrado: ${aluno.nome}` : 'NÃO ENCONTRADO');
//     console.log('Resultado Turma:', turma ? `Encontrada ID: ${turma.id}` : 'NÃO ENCONTRADA');

//     if (!aluno || !turma) {
//       // 3. LOG DE VERIFICAÇÃO DE TABELA: Tenta listar o que tem no banco
//       const todosAlunos = await this.alunoRepo.find({ take: 1 });
//       console.log('Primeiro aluno do banco para teste:', todosAlunos);
      
//       throw new NotFoundException({
//         mensagem: 'Aluno ou turma não encontrados',
//         debug: {
//           idAlunoBuscado: idAluno,
//           idTurmaBuscada: idTurma,
//           alunoExiste: !!aluno,
//           turmaExiste: !!turma
//         }
//       });
//     }