const tabelaContainer = document.querySelector('.table-content');

window.addEventListener("load", async function () {
  const res = await axios.get(`/sistemas/pdi/elegiveis/pagina/${paginacao}`);
  criarTabela(res.data.servidor);

});

function criarTabela(dados) {
  if (!dados) return;


  const tabela = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  tabela.classList.add('rtable', 'table', 'text-center', 'table-striped');
  thead.classList.add('color-input', 'align-middle');
  tbody.classList.add('realceLinha');


  thead.innerHTML = `
        <th class="cabecalho text-center">Matrícula</th>
        <th class="cabecalho text-center">Nome</th>
        <th class="cabecalho text-center">Cargo</th>
        <th class="cabecalho text-center">Tempo</th>
        <th class="cabecalho text-center">Data de admissão</th>
        <th class="cabecalho text-center">Referência</th>
        <th class="cabecalho text-center">Sal. Referência</th>
        <th class="cabecalho text-center">PDI</th>

    `
  dados.forEach((d) => {
    const tr = document.createElement("tr");
    tr.classList.add("espacamento-tabelas");
    tr.innerHTML = `
         <td data-title="Matricula:">
        ${d.matricula}
      </td>
      <td data-title="Nome:" class="text-primary fw-bold">${d.nome}</td>
      <td data-title="Cargo:">
        ${d.cargoEfetivo}
      </td>
      <td data-title="Tempo:">
        ${d.tempoServico} anos
      </td>
      <td data-title="Data:">
        ${new Date(d.dataAdmissao).toLocaleDateString('pt-BR',
      { timeZone: 'GMT' })}
      </td>
      <td data-title="Referencia:">
        ${d.referencia}
      </td>
      <td data-title="Remuneração:">
        ${d.salarioEfetivo.toLocaleString('pt-BR', {
        style:
          'currency', currency: 'BRL'
      })}
      </td>
      <td data-title="Acordo:" class="text-danger fw-bold">${d.valorPdi}</td>
      if (resultado.next) {
        <a class="page-link text-purple" href="/sistemas/pdi/elegiveis/pagina/${resultado.paginacao + 1}"
          ><span aria-hidden="true">&raquo;</span></a>
      } 
        
      `
    tbody.appendChild(tr);
  })
  tabela.appendChild(thead);
  tabela.appendChild(tbody);
  tabelaContainer.appendChild(tabela);
}