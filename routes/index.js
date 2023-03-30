const express = require('express')
const router = express.Router()
const path = require('path')
const cors = require('cors')

//OUTROS REQUIRES
const bodyParser = require('body-parser')
const chalk = require('chalk');


//EXCEL
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Planilha1');
const moment = require('moment')


const REFERENCIA_R5 = 2255
const TEMPO_SERVICO_MAX = 35
const INCENTIVO_MAX = REFERENCIA_R5 * TEMPO_SERVICO_MAX

function calculaPDI(base, tempo) {
  let resultado = base * tempo
  resultado = resultado <= INCENTIVO_MAX ? resultado : INCENTIVO_MAX
  return resultado
}



const Funcionario = require('../models/funcionario')

const FuncionarioController = require('../controller/funcionarioController')
const AuthController = require('../controller/authController')
const systemController = require('../controller/systemController')
const newUser = require('../controller/adminController')

const authRoutes = require('../middlewares/auth')
const isAdmin = require('../middlewares/isAdmin')
const adminController = require('../controller/adminController')

// ROTAS GET
router.get('/funcionarios', FuncionarioController.index, (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
})
router.get('/procurar', FuncionarioController.searchUser)
router.get('/main', FuncionarioController.getUser)

router.get('/sistemas/pdi/login', (req, res) => {
  res
    .status(200)
    .render(path.join(__dirname, '../views/sistemas-pdi/login', 'index'))
})

router.get('/sistemas/pdi/main', authRoutes.verifyToken, (req, res) => {
  res
    .status(200)
    .render(path.join(__dirname, '../views/sistemas-pdi', 'main'), {
      usuario: req.servidor
    })
})

router.get('/sistemas/pdi/termos', authRoutes.verifyToken, (req, res) => {
  res
    .status(200)
    .render(path.join(__dirname, '../views/sistemas-pdi/termos/', 'termos'), {
      matricula: req.servidor.matricula
    })
})

router.get(
  '/sistemas/pdi/lista',
  authRoutes.verifyToken,
  isAdmin.isAdmin,
  async (req, res) => {
    try {
      res
        .status(200)
        .render(path.join(__dirname, '../views/sistemas-pdi/lista/', 'lista'))
    } catch (error) {
      console.log(error)
    }
  }
)

//EXCEL 
router.get('/sistemas/pdi/relatorios', authRoutes.verifyToken, isAdmin.isAdmin, async (req, res) => {
 
  Funcionario.findAll({
    where: {
      aderiuPdi: 1
    }
    
    }).then(funcionarios => {
      
    //VERIFICA SE EXISTE LINHAS NO ARQUIVO, E SE SIM, APAGA!    
    for (let l = worksheet.rowCount; l>=1; l--){
      worksheet.spliceRows(l, 1);
    }

    funcionarios.forEach(funcionario => {
      
      worksheet.columns = 
      [
        {header: 'NOME', key: 'nome'},
        {header: 'CPF', key: 'cpf'},
        {header: 'MATRICULA', key: 'matricula'},
        {header: 'E-MAIL', key: 'email'},
        {header: 'DATA DE ADMISSAO', key: 'dataAdmissao'},
        {header: 'TEMPO DE SERVICO', key: 'tempoServico'},
        {header: 'CARGO EFETIVO', key: 'cargoEfetivo'},
        {header: 'SALARIO EFETIVO', key: 'salarioEfetivo'},
        {header: 'UNIDADE', key: 'unidade'},
        {header: 'REFERENCIA', key: 'referencia'},
        {header: 'VALOR PDI', key: 'valorPdi'}
      ]

      worksheet.addRow(
        {
          nome: funcionario.nome,
          cpf: funcionario.cpf,
          matricula: funcionario.matricula,
          email: funcionario.email,
          dataAdmissao: moment(funcionario.dataAdmissao).format('DD/MM/YYYY'),
          tempoServico: funcionario.tempoServico.toString() + ' anos',
          cargoEfetivo: funcionario.cargoEfetivo,
          salarioEfetivo: funcionario.salarioEfetivo.toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}),
          unidade: funcionario.unidade,
          referencia: funcionario.referencia,
          valorPdi: calculaPDI(funcionario.salarioEfetivo, funcionario.tempoServico).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }
      )
    
    
      //LARGURAS COLUNAS
      worksheet.getColumn(1).width = 40; //NOME
      worksheet.getColumn(2).width = 17; //CPF 
      worksheet.getColumn(3).width = 17; //MATRICULA
      worksheet.getColumn(4).width = 32; //E-MAIL
      worksheet.getColumn(5).width = 25; //DATA ADMISSÃO
      worksheet.getColumn(6).width = 23; //TEMPO DE SERVIÇO
      worksheet.getColumn(7).width = 40; //CARGO EFETIVO
      worksheet.getColumn(8).width = 22; //SALARIO EFETIVO
      worksheet.getColumn(9).width = 40; //UNIDADE
      worksheet.getColumn(10).width = 16; //REFERENCIA
      worksheet.getColumn(11).width = 15; //VALOR PDI


      //FILTRO CABECALHO
      worksheet.autoFilter = {
      from: 'A1',
      to: 'K1'
      }

      //ALINHAR CABECALHO
      const alinharCabecalho = worksheet.getRow(1)
      alinharCabecalho.alignment ={
        vertical: 'middle', horizontal: 'center'
      }

      //COR DA FONTE CABECALHO
      const fonte = worksheet.getRow(1)
      fonte.font = {
        bold:true,
        color: { argb: 'FFFF0000' }
      }

      //BACKGROUD CABECALHO
      const fundo = worksheet.getRow(1)
      fundo.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' }
      }

      //ALINHAR COLUNAS ESPECIFICAS
      const alinharEspecifico = ['B', 'C', 'E', 'F', 'H', 'J','K'];
      alinharEspecifico.forEach(coluna => {
        const colunas = worksheet.getColumn(coluna);
        colunas.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      
      //BORDA TABELA
      const borda = {
        style: 'thin',
      }
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: borda,
            left: borda,
            bottom: borda,
            right: borda
          }
        })
      })
      workbook.xlsx.writeFile('relatorio.xlsx')
    })
  })
  res.redirect('/sistemas/pdi/elegiveis/pagina/1')
})

//PAGINAÇÃO 
router.get('/sistemas/pdi/elegiveis/pagina/:num', authRoutes.verifyToken, isAdmin.isAdmin, async (req, res) => {
  
  let limit = parseInt(req.query.limit) || 10; // VALOR PADRÃO DE ITENS MOSTRADOS = 10
  const pagina = parseInt(req.params.num) || 1; // VALOR PADRÃO DO NUMERO DA PAGINA = 10
  const offset = (pagina - 1) * limit;
     
    Funcionario.findAndCountAll({
      
      where: {
        aderiuPdi: 1
      },

      limit: limit, 
      offset: offset

    }).then(funcionarios => {   
      let totalFuncionarios = funcionarios.count;

      if (limit > totalFuncionarios){
        limit = totalFuncionarios 
      }
      console.log(chalk.yellow(`O total de funcionários é: ${totalFuncionarios}`))

      const resultado = {
        paginacao: pagina,
        next: (pagina * limit) < totalFuncionarios,
        funcionarios: funcionarios,
        totalFuncionarios: totalFuncionarios
      }
        
      console.log(chalk.cyan(`O valor de limite é: ${limit}`))
      res.render('sistemas-pdi/lista/paginacao', {resultado, limit}) 
   })
 })


router.get(
  '/sistemas/pdi/listaInteressados',
  //ESSA ROTA NÃO ESTA MAIS SENDO UTILIZADA.
  authRoutes.verifyToken,
  isAdmin.isAdmin,
  async (req, res) => {
    
    
    try {
      const interestedServs = await Funcionario.findAll({
        where: {
          aderiuPdi: 1
        },
        limit: 10
      })

      if (!interestedServs)
        return res
          .status(400)
          .json({ message: 'Nenhum funcionário encontrado' })
      interestedServs.forEach(e => {
        e.senha = '***'
        e.valorPdi = calculaPDI(
          e.salarioEfetivo,
          e.tempoServico
        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      })

      res.status(200).json({ servidor: interestedServs })
    } catch (error) {
      console.error(error)
    }
  }
)
/*router.get('/sistemas/pdi/elegiveis', (req, res) => {
  res.status(200).render(path.join(__dirname, '../views/sistemas-pdi/lista', 'elegiveis'));
});*/

router.get(
  '/sistemas/pdi/elegiveis',
  authRoutes.verifyToken,
  isAdmin.isAdmin,
  async (req, res) => {
    const funcionario = await Funcionario.findAll()

    res
      .status(200)
      .render(
        path.join(__dirname, '../views/sistemas-pdi/lista', 'elegiveis'),
        {
          funcionarios: funcionario
        }
      )
  }
)

// ROTAS POST
router.post('/auth', AuthController.login)

// ROTA BUNDLE
router.get('/', (req, res) => {
  res.status(200).render(path.join(__dirname, '../views', 'bundle'))
})

router.get(
  '/sistemas/pdi/user/:mat',
  authRoutes.verifyToken,
  FuncionarioController.getSingleUser
)

router.get('/newUser', adminController.createUser)

router.post(
  '/sistemas/pdi/user/:mat',
  authRoutes.verifyToken,
  FuncionarioController.updateUserInterest
)

// logout
router.get(
  '/sistemas/pdi/logout',
  authRoutes.verifyToken,
  systemController.logout
)
module.exports = router
