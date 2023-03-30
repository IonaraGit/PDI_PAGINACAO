/* const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// configuração de recursos usados pelo servidor
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// porta 3000 ou qualquer porta no .env
const PORT = 3001;

// rota bundle
const bundle = require("./routes/bundle");

// rota PDI
const routes = require("./routes/index");

// ativa rotas sistema de horas
app.use(bundle);
app.use(routes);

app.listen(PORT, () => {
  console.log("Server rodando na porta " + PORT);
});
 */