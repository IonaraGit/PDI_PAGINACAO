const Funcionario = require('../models/funcionario');
const bcrypt = require("bcrypt");

module.exports = {
    async createUser(req, res) {
        try {
           let { matricula, senha, nome } = req.body;

           const hashSenha = await bcrypt.hash(senha, 16);
           
           const newUser = await Funcionario.create({
               matricula: matricula,
               nome: nome,
               senha: hashSenha,
               isAdmin: 0,
               dataAdmissao: Date.now(),
               tempoServico: 0,
               cargoEfetivo: '-',
               salarioEfetivo: 0,
               unidade: '-',
               referencia: 'R0',
               valorPdi: 0,
               aderiuPdi: 0
               
            })
            
            return res.status(200).json({ message: 'Usuário criado com sucesso!'});
        } catch (error) {
            console.log(error);
        }
    },

    async addPdi (req, res) {
        try {
            
        } catch (error) {
            console.log(error)
        }
    },

    async resetPassword (req, res) {
        try {
            let { matricula } = req.body;
            let funcionario = await Funcionario.findOne({
                where: {
                    matricula: matricula
                }
            });
            let regex = /\d/g;
            funcionario.senha = funcionario.cpf.match(regex).join("");
            const hashSenha = await bcrypt.hash(funcionario.senha, 16);
            funcionario.senha = hashSenha;

            return res.status(200).json({ message: 'Senha resetada com sucesso!'});
        } catch (error) {
            console.log('Erro ao resetar a senha');
        }
    }
}