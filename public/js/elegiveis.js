
// REQUISIÃO AXIOS VERIFICAR
const url = "/funcionarios";


//FUNÇÃO PARA CRIAR A TABELA DE SERVIDORES ELEGÍVEIS
function getUser() {
  axios.get(url)
    .then((response) => {
      const data = response.data;

      var tbody = document.querySelector('tbody')
      data.forEach(itens => {

        var tr = document.createElement('tr')
        for (var campo in itens) {
          var td = document.createElement('td')
          td.innerHTML = itens[campo];
          tr.appendChild(td)
        }
        tbody.appendChild(tr)
      })

    })
    .catch(error => {
      if (!error.response) {
        // network error
        this.errorStatus = 'Error: Network Error';
      } else {
        this.errorStatus = error.response.data.message;
      }
    })
}
getUser();


//FUNÇÃO PARA ACEITAR SÓ NÚMEROS NO INPUT 
function onlynumber(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;

  key = String.fromCharCode(key);
  //var regex = /^[0-9.,]+$/;
  var regex = /^[0-9.]+$/;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

//FUNÇÃO PARA BUSCAR SERVIDOR PELA MATRICULA
function buscarServidor() {

  let dados = parseInt(document.getElementById('buscarElegivel').value);
  let resultado = document.getElementById('resultado');
  axios.get(`/sistemas/pdi/user/${dados}`)
    .then((response) => {

      const data = response.data.funcionario;


      var tbody = document.getElementById('tabela-modal');
      var tr = document.createElement('tr')

      /* for (var campo in data) {
        var td = document.createElement('td');
        td.innerHTML = data[campo];
        tr.appendChild(td);
      } */

      var tdNome = document.createElement('td');
      var tdMatricula = document.createElement('td');
      var tdDataAd = document.createElement('td');
      var tdTempoServ = document.createElement('td');
      var tdCargo = document.createElement('td');
      var tdSal = document.createElement('td');
      var tdRef = document.createElement('td');
      var tdPdi = document.createElement('td');
      var tdAdd = document.createElement('td');
      var tdImgAdd = document.createElement('img');
      tdImgAdd.setAttribute('src', '/assets/img/plus-square.svg');
      tdImgAdd.classList.add('img-adicionar');

      tdNome.innerHTML = data.nome;
      tdMatricula.innerHTML = data.matricula;
      tdDataAd.innerHTML = new Date(data.dataAdmissao).toLocaleDateString("pt-br", { timeZone: "GMT" });
      tdTempoServ.innerHTML = data.tempoServico;
      tdCargo.innerHTML = data.cargoEfetivo;
      tdSal.innerHTML = data.salarioEfetivo;
      tdRef.innerHTML = data.referencia;
      tdPdi.innerHTML = data.valorPdi;
      tdAdd.appendChild(tdImgAdd);

      tr.appendChild(tdNome);
      tr.appendChild(tdMatricula);
      tr.appendChild(tdDataAd);
      tr.appendChild(tdTempoServ);
      tr.appendChild(tdCargo);
      tr.appendChild(tdSal);
      tr.appendChild(tdRef);
      tr.appendChild(tdPdi);
      tr.appendChild(tdAdd);

      tbody.appendChild(tr);

    })
    .catch((error) => {
      console.error(error);
    })

}

function fecharModal() {
  document.location.reload(true);
}


//BOTÃO DE VOLTAR AO TOPO
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}







/* const searchInput = document.getElementById("search-matricula");
const searchButton = document.getElementById("search-btn");
const tableContainer = document.querySelector(".table-content");

searchButton.addEventListener("click", async (e) => {
  if (!searchInput.value) {
    Swal.fire({
      title: "NENHUMA MATRICULA INFORMADA!",
      text: "Por favor, informe a matricula do servidor.",
      icon: "error",
      confirmButtonText: "Certo",
    }).then(() => {
      searchInput.value = "";
      return;
    });
  }

  try {
    const res = await axios.get(`/sistemas/pdi/user/${searchInput.value}`);

    const addTableToDOM = new Promise((resolve, reject) => {
      resolve(createTable(res.data.funcionario));
    });

    addTableToDOM.then(() => {
      const addServButton = document.getElementById("add-servi__interessados");

      addServButton.addEventListener("click", async (e) => {
        try {
          const response = await axios.put(
            `/sistemas/pdi/user/${res.data.funcionario.matricula}`
          );

          Swal.fire({
            title: "SUCESSO!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "Certo",
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "ALGO ERRADO!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "Certo",
          }).then(() => {
            window.location.reload();
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
});

function createTable(data) {
  if (!data) return;

  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("rtable", "realceLinha", "table");

  table.innerHTML = `
        <thead class="color-input align-middle">
            <th class="cabecalho text-center">Matri­cula</th>
            <th class="cabecalho text-center">Nome</th>
            <th class="cabecalho text-center">Cargo</th>
            <th class="cabecalho text-center">Tempo</th>
            <th class="cabecalho text-center">Data de admissão</th>
            <th class="cabecalho text-center">Referência</th>
            <th class="cabecalho text-center">Sal. Referência</th>
            <th class="cabecalho text-center">Indenização</th>
            <th class="cabecalho text-center">Detalhes</th>
        </thead>

        <tbody>
            <tr class="espacamento-tabelas">
            <th class="cabecalho-responsivo-servidor" style="padding: 10px">
                Servidor
            </th>
            <td data-title="Matricula:" class="matricula-servidor">${
              data.matricula
            }</td>
            <td data-title="Nome:" class="nome-servidor">${data.nome}</td>
            <td data-title="Cargo:" class="cargo-servidor">
                ${data.cargoEfetivo}
            </td>
            <td data-title="Tempo:" class="tempo-servidor">${
              data.tempoServico
            } anos</td>
            <td data-title="Data:" class="data-servidor">${new Date(
              data.dataAdmissao
            ).toLocaleDateString("pt-BR", { timeZone: "GMT" })}</td>
            <td data-title="Referencia:" class="referencia-servidor">${
              data.referencia
            }</td>
            <td data-title="RemuneraÃ§Ã£o:">${data.salarioEfetivo}</td>
            <td data-title="Acordo:">${data.valorPdi}</td>
            <td data-title="Ação:">
                <button id='add-servi__interessados'>Adicionar a Lista</button>
            </td>
            </tr> 
        </tbody>

  `;

  tableContainer.appendChild(table);
  return;
}
 */