const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Funcionario = sequelize.define('Funcionarios', {
    cpf: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    nome: DataTypes.STRING,
    matricula: DataTypes.STRING,
    dataAdmissao: DataTypes.DATEONLY,
    tempoServico: DataTypes.INTEGER,
    cargoEfetivo: DataTypes.STRING,
    salarioEfetivo: DataTypes.FLOAT,
    unidade: DataTypes.STRING,
    referencia: DataTypes.STRING,
    valorPdi: DataTypes.FLOAT,
    isAdmin: DataTypes.TINYINT,
    aderiuPdi: DataTypes.TINYINT
  });

  module.exports = Funcionario;