"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Funcionarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cpf: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      senha: {
        type: Sequelize.STRING,
      },
      nome: {
        type: Sequelize.STRING,
      },
      matricula: {
        type: Sequelize.STRING,
      },
      dataAdmissao: {
        type: Sequelize.DATE,
      },
      tempoServico: {
        type: Sequelize.INTEGER,
      },
      cargoEfetivo: {
        type: Sequelize.STRING,
      },
      salarioEfetivo: {
        type: Sequelize.FLOAT,
      },
      unidade: {
        type: Sequelize.STRING,
      },
      referencia: {
        type: Sequelize.STRING,
      },
      valorPdi: {
        type: Sequelize.FLOAT,
      },
      isAdmin: {
        type: Sequelize.TINYINT,
      },
      aderiuPdi: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Funcionarios");
  },
};
