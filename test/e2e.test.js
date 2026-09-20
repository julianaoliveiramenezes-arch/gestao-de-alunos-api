import { api } from './helpers/api.js'; 
import { expect } from 'chai'; 
import { comTokenDeAdmin } from './helpers/auth.js'; 
import { novoAluno } from './factories/alunosFactory.js'; 
import { novaDisciplina } from './factories/disciplinasFactory.js';

describe('Fluxo E2E: Autenticação, Cadastro e Entrega de Trabalho', () => {

    it('Validar que um aluno cadastrado pode se matricular, logar e entregar um trabalho', async () => {

        // 1. Cadastrar novo aluno como Admin
        const dadosAluno = novoAluno();
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(dadosAluno);

        expect(cadastroAlunoResposta.status).to.equal(201);
        const alunoId = cadastroAlunoResposta.body.id;
       // console.log(`Aluno ${alunoId} cadastrado com sucesso.`);

        // 2. Cadastrar uma nova disciplina como Admin
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina());

        expect(cadastroDisciplinaResposta.status).to.equal(201);
        const disciplinaId = cadastroDisciplinaResposta.body.id;
        //console.log(`Disciplina ${disciplinaId} cadastrada com sucesso.`);

        // 3. Matricular o aluno na disciplina cadastrada
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({ alunoId: alunoId });

        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
       // console.log(`Aluno ${alunoId} matriculado na disciplina ${disciplinaId} com sucesso.`);

        // 4. Logar com o novo aluno criado
        const loginAlunoResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: dadosAluno.email, 
                senha: dadosAluno.senha
            });

        expect(loginAlunoResposta.status).to.equal(200);
        expect(loginAlunoResposta.body).to.have.property('token');
        const tokenAluno = `Bearer ${loginAlunoResposta.body.token}`;
        //console.log(`Login do aluno ${alunoId} realizado com sucesso.`);

        // 5. Registrar a entrega de trabalho pelo Aluno
        const entregaTrabalhoResposta = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAluno)
            .send({
                disciplinaId: disciplinaId,
                titulo: 'Lista de Exercícios 21-40',
                descricao: 'Resolução dos exercícios de 21 a 40 do capítulo 2.'
            });

        expect(entregaTrabalhoResposta.status).to.equal(201);
        expect(entregaTrabalhoResposta.body).to.have.property('id');
        expect(entregaTrabalhoResposta.body.titulo).to.equal('Lista de Exercícios 21-40');
        //console.log(`Trabalho entregue com sucesso pelo aluno ${alunoId}.`);
    });

});