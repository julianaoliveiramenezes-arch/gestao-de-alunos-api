import request from 'supertest';
import{ expect } from 'chai';
import { getToken } from './helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import 'dotenv/config';

//verificar o que faz o import { readFileSync } from 'fs'; no final do arquivo, se não for usado, remover
import { readFileSync } from 'fs';


describe('Testes da entrega do trabalho - API', () => {
    let token;

    beforeEach(async () => {
        // Obter o token de autenticação antes de executar os testes
        token = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
    });

    it('Validar cadastro de um novo aluno - dados validos', async () => {
        const novoAluno = await request(process.env.BASE_URL)
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Maria da Silva',
                email: 'maria.silva@example.com',
                matricula: '202600410',
                senha: 'senha#123'
            });
            //validar que o Aluno foi criado com sucesso, verificando o status code da resposta
            expect(novoAluno.status).to.equal(201);
            expect(novoAluno.body.nome).to.equal('Maria da Silva');
            expect(novoAluno.body.email).to.equal('maria.silva@example.com');

            let alunoId = novoAluno.body.id;



        });
    });
