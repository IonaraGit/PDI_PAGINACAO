const Funcionario = require("../models/funcionario");
const REFERENCIA_R5 = 2255;
const TEMPO_SERVICO_MAX = 35;
const INCENTIVO_MAX = REFERENCIA_R5 * TEMPO_SERVICO_MAX;

function calculaPDI(base, tempo) {
  let resultado = base * tempo;
  resultado = resultado <= INCENTIVO_MAX ? resultado : INCENTIVO_MAX;
  return resultado;
}

/* function converte(data) {
  let dateString = data.split("-");
  let stringFormatada = `${dateString[2]}/${dateString[1]}/${dateString[0]} `;
  return stringFormatada;
}
 */
module.exports = {
  // Mostra lista de todos os funcionários elegiveis para o PDI
  async index(req, res) {
    let array = [];

    const funcionarios = await Funcionario.findAll({
      attributes: [
        "matricula",
        "nome",
        "cpf",
        "cargoEfetivo",
        "tempoServico",
        "dataAdmissao",
        "referencia",
        "valorPdi",
        "unidade",
        "salarioEfetivo",
      ],
    });
    funcionarios.forEach((element) => {
      /* let stringCorreta = converte(element.dataAdmissao); */

      element.dataAdmissao = new Date(element.dataAdmissao);
      element.valorPdi = calculaPDI(
        element.salarioEfetivo,
        element.tempoServico
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    });
    return res.json(funcionarios);
  },

  // Procura um funcionario
  async searchUser(req, res) {
    try {
      const { matricula } = req.body;
      const funcionario = await Funcionario.findOne({
        where: {
          matricula: matricula,
        },
      });
      if (!funcionario) throw { message: "Funcionário não encontrado" };
      funcionario.valorPdi = calculaPDI(
        funcionario.salarioEfetivo,
        funcionario.tempoServico
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      return res.json(funcionario);
    } catch (error) {
      res.status(404).send(error);
    }
  },

  async getUser(req, res) {
    try {
      const { matricula } = req.body;
      const funcionario = await Funcionario.findOne({
        where: {
          matricula: matricula,
        },
      });
      if (!funcionario) throw { message: "Funcionário não encontrado" };
      funcionario.valorPdi = calculaPDI(
        funcionario.salarioEfetivo,
        funcionario.tempoServico
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      return res.json(funcionario);
    } catch (error) {
      res.status(404).send(error);
    }
  },

  async getSingleUser(req, res) {
    const { mat } = req.params;
    try {
      const funcionario = await Funcionario.findOne({
        where: {
          matricula: mat,
        },
      });
      if (!funcionario) throw { message: "Funcionário não encontrado" };

      funcionario.senha = "";
      funcionario.valorPdi = calculaPDI(
        funcionario.salarioEfetivo,
        funcionario.tempoServico
      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      res.status(200).json({ funcionario });
    } catch (error) { }
  },

  async updateUserInterest(req, res) {
    const { mat } = req.params;

    try {
      const serv = await Funcionario.findOne({ where: { matricula: mat } });

      if (!serv)
        return res.status(400).json({ message: "Funcionário não encontrado." });

      await serv.update({
        aderiuPdi: true,
      });

      await serv.save();

      res
        .status(200)
        .json({ message: "Funcionário adicionado a lista de interessados." });
    } catch (error) {
      console.log(error);
    }
  },
};
/*
router.get("/sistemas/pdi/elegiveis", (req, res) => {
  let search = '';
  if (req.query.search) {
     search = req.query.search
  }
  Funcionario.findAll().then (funcionarios => {
    res.render('views/sistemas-pdi/lista/elegiveis', {funcionarios: funcionarios})
  })
   
  })*/
