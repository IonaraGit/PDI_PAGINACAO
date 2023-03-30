

const matricula = document.querySelector(".mat-hidden");

function sucesso() {
  let chkDecreto = document.getElementById("checkDecreto");
  let chkTermo = document.getElementById("checkTermo");

  let success = document.getElementById("alertSuccess");
  let warning = document.getElementById("alertWarning");

  //evitar inserção de dados duplicados:

  //se existe matricula,
  //alerta que já existe uma matrícula na lista de interessados

  if (chkDecreto.checked && chkTermo.checked) {
    axios
      .post(`/sistemas/pdi/user/${matricula.textContent}`)
      .then((res) => {
        success.classList.remove("d-none");
        setTimeout("location.reload();", 100000);
      })
      .catch(() => {
        warning.classList.remove("d-none");
        setTimeout("location.reload();", 5000);
      });
  }
}
const button = document.querySelector("#btn");
button.addEventListener("click", sucesso);
