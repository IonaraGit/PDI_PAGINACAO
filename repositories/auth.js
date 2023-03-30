const Funcionario = require('../models/funcionario');

module.exports = {
  async getUser(matricula) {
    const funcionario = await Funcionario.findOne({
      where: { matricula }
    })
    return funcionario;
  }
}