window.addEventListener("load", async function () {
  const matricula = document.getElementById("matricula").placeholder;
  const admissao = document.getElementById("admissao");
  const tempo = document.getElementById("tempo");
  const referenciaSalarial = document.getElementById("referenciaSalarial");
  const pdi = document.getElementById("pdi");

  const res = await axios.get(`/sistemas/pdi/user/${matricula}`);

  let funcionario = res.data.funcionario;
  let admissaoString = new Date(funcionario.dataAdmissao).toLocaleDateString(
    "pt-BR"
  );
  let tempoString = `${funcionario.tempoServico} anos`;
  let referenciaString = `(${funcionario.referencia
    }) - ${funcionario.salarioEfetivo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;
  let pdiString = funcionario.valorPdi;

  admissao.textContent = admissaoString;
  tempo.textContent = tempoString;
  referenciaSalarial.textContent = referenciaString;
  pdi.textContent = pdiString;
  return;
});

// REQUISIÃO AXIOS VERIFICAR
/* const matricula = document.getElementById("matricula").placeholder;
const url = `http://localhost:3001/funcionarios`;
const getUser = axios.get(url).then((response) => {
}).catch((erro) => {
  console.log(erro)
}); */



//tooltip
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

//tooltip popover
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

var popover = new bootstrap.Popover(
  document.querySelector(".example-popover"),
  {
    container: "body",
  }
);
