const database = require('../database/connection');
const Aluno = require('../models/aluno');
const {checkExistence} = require("../utils/databaseUtil");

class AlunoController {

    get(req, res) {
        database.select().from('Aluno').then((data) => {
            console.log(data);
            let obj = data.map(item => ({matricula: item.matricula, nome: item.nome, curso: item.id_curso}));

            res.send(obj);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Erro ao buscar os alunos!');
        });
    }

    post(req, res) {
        const {matricula, nome, curso} = req.body;
        let obj = {
            matricula: matricula,
            nome: nome,
            id_curso: curso
        };
        if (curso === undefined || curso === '') {
            res.status(400).send('Curso não informado!');
        }

        database.select().from('Curso').where('id', curso).then((exist) => {
            if (exist.length === 0) {
                res.status(400).send('Curso não encontrado!');
            } else {
                database('Aluno').insert(obj).then(() => {
                    res.send('Aluno cadastrado com sucesso!');
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send('Erro ao cadastrar aluno!');
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(400).send('Curso não encontrado!');
        });
    }

    put(req, res) {
        const {matricula, nome, curso} = req.body;
        let obj = {
            matricula: matricula,
            nome: nome,
            id_curso: curso
        };

        database('Aluno').where('matricula', matricula).then((exist) => {
            if (exist.length === 0) {
                res.status(400).send('Aluno não encontrado!');
            } else {
                database.select().from('Curso').where('id', curso).then((exist) => {
                    if (exist.length === 0) {
                        res.status(400).send('Curso não encontrado!');
                    } else {
                        database('Aluno').where('matricula', matricula).update(obj).then(() => {
                            res.send('Aluno atualizado com sucesso!');
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).send('Erro ao atualizar aluno!');
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    res.status(400).send('Curso não encontrado!');
                });
            }
        });
    }

    delete(req, res) {
        const {matricula} = req.body;


        database('Aluno').where('matricula', matricula).then((exist) => {
            if (exist.length === 0) {
                res.status(400).send('Aluno não encontrado!');
            } else {
                database('Turma_Aluno').where('Matricula_Aluno', matricula).then((exist) => {
                    if (exist.length > 0) {
                        res.status(400).send('Aluno está cadastrado em uma turma!');
                    } else {
                        database('Aluno').where('matricula', matricula).del().then(() => {
                            res.send('Aluno deletado com sucesso!');
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).send('Erro ao deletar aluno!');
                        });
                    }
                });
            }
        });
    }
}

module.exports = new AlunoController();