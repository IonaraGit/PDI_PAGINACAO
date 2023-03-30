const path = require("path");
const Funcionario = require("../models/funcionario");

module.exports = {
  async mainPage(req, res) {
    return res
      .status(200)
      .render(path.join(__dirname, "../views/sistemas-pdi/", "main"), {
        usuario: req.servidor,
      });
  },

  logout(req, res) {
    res.clearCookie("token").status(200).redirect("/sistemas/pdi/login");
  },
};
