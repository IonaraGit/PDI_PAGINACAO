const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes');
const headers = require('./config/headers');
const cookieParser = require('cookie-parser');
const bodyParser = require ('body-parser')



dotenv.config();
PORT = process.env.PORT;

const app = express();
app.use(cors({
  origin: 'http://localhost:3001/'
}));
/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */


app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(router);



app.use(bodyParser.json());

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log(`Server ligado na porta ${PORT}`);
})