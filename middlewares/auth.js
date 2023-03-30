const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async verifyToken(req, res, next) {
    const token = req.cookies.token;

    try {
      if (!token) return res.status(400).redirect("/sistemas/pdi/login");

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      if (!decoded) return res.status(401).redirect("/sistemas/pdi/login");

      req.servidor = decoded;

      next();
    } catch (error) {
      console.error(error);
    }
  },
};
