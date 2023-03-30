const { getUser } = require("../repositories/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async login(req, res) {
    try {
      const { matricula, senha } = req.body;
      const funcionario = await getUser(matricula);

      if (!funcionario)
        return res
          .status(400)
          .json({
            message:
              "Funcionário não encontrado ou você não é elegível ao PDI, entre em contato com sua chefia.",
          });

      if (!bcrypt.compareSync(senha, funcionario.senha))
        return res
          .status(403)
          .json({ message: "Matricula ou senha invalidas." });

      const token = jwt.sign(
        {
          id: funcionario.id,
          matricula: funcionario.matricula,
          nome: funcionario.nome,
          isAdmin: funcionario.isAdmin,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      // Colocando o token em um cookie
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ message: "AUTENTICADO COM SUCESSO!" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
