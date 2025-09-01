
const dadosIniciais = [
  { 
    nome: "Andressa Alves", 
    posicao: "MC", 
    clube: "Corinthians", 
    foto: "src/img/AndressaAlves.png", 
    pac: 82, sho: 85, pas: 88, dri: 89, def: 70, phy: 78, favorita: false 
  },
  { 
    nome: "Dayana Rodríguez", 
    posicao: "MC", 
    clube: "Corinthians", 
    foto: "src/img/Dayana.jpeg", 
    pac: 78, sho: 72, pas: 86, dri: 84, def: 74, phy: 79, favorita: false 
  },
  { 
    nome: "Mariza", 
    posicao: "ZAG", 
    clube: "Corinthians", 
    foto: "src/img/Mariza.jpeg", 
    pac: 70, sho: 55, pas: 60, dri: 63, def: 86, phy: 83, favorita: false 
  },
  { 
    nome: "Thaís Regina", 
    posicao: "ZAG", 
    clube: "Corinthians", 
    foto: "src/img/Thais.jpeg", 
    pac: 68, sho: 57, pas: 62, dri: 64, def: 84, phy: 82, favorita: false 
  },
  { 
    nome: "Letícia Teles", 
    posicao: "ZAG", 
    clube: "Corinthians", 
    foto: "src/img/Leticia.jpeg", 
    pac: 65, sho: 45, pas: 55, dri: 58, def: 80, phy: 79, favorita: false 
  }
];

let jogadoras = JSON.parse(localStorage.getItem("jogadoras_fifa")) || [];
if (jogadoras.length === 0) {
  jogadoras = dadosIniciais;
  localStorage.setItem("jogadoras_fifa", JSON.stringify(jogadoras));
}

// Elementos DOM
const form = document.getElementById("jogadora-form");
const cardsContainer = document.getElementById("cards-container");
const buscaInput = document.getElementById("busca");
const filtroTime = document.getElementById("filtro-time");
const ordenarNomeBtn = document.getElementById("ordenar-nome");
const ordenarPosicaoBtn = document.getElementById("ordenar-posicao");

// Funções auxiliares
function salvarDados() {
  localStorage.setItem("jogadoras_fifa", JSON.stringify(jogadoras));
}

function placarMedia(j) {
  const v = [j.pac, j.sho, j.pas, j.dri, j.def, j.phy];
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}

function imgFallback(e) {
  e.target.onerror = null;
  e.target.src = "https://placehold.co/600x800?text=Foto+da+Jogadora";
}

// Renderização dos cards
function renderizarCards(lista = jogadoras) {
  cardsContainer.innerHTML = "";
  lista.forEach((jogadora, index) => {
    const card = document.createElement("article");
    card.className = "card";

    const rating = placarMedia(jogadora);

    card.innerHTML = `
      <div class="card-head">
        <div class="badge">${rating}</div>
        <div class="badge">${jogadora.posicao}</div>
        <div class="badge">${jogadora.clube}</div>
      </div>

      <div class="card-body">
        <img src="${jogadora.foto}" alt="${jogadora.nome}" onerror="imgFallback(event)"/>
        <div class="card-name">${jogadora.nome}</div>
        <div class="attrs">
          <div class="attr"><span>PAC</span><span>${jogadora.pac ?? 0}</span></div>
          <div class="attr"><span>SHO</span><span>${jogadora.sho ?? 0}</span></div>
          <div class="attr"><span>PAS</span><span>${jogadora.pas ?? 0}</span></div>
          <div class="attr"><span>DRI</span><span>${jogadora.dri ?? 0}</span></div>
          <div class="attr"><span>DEF</span><span>${jogadora.def ?? 0}</span></div>
          <div class="attr"><span>PHY</span><span>${jogadora.phy ?? 0}</span></div>
        </div>
      </div>

      <div class="card-actions">
        <button class="icon-btn fav ${jogadora.favorita ? "active": ""}" title="Favoritar">
          ${jogadora.favorita ? "★ Favorita" : "☆ Favoritar"}
        </button>
        <button class="icon-btn edit" title="Editar">✎ Editar</button>
        <button class="icon-btn remove" title="Remover">🗑 Remover</button>
      </div>
    `;

    // Eventos
    card.querySelector(".fav").addEventListener("click", () => {
      jogadora.favorita = !jogadora.favorita;
      salvarDados();
      renderizarCards();
    });

    card.querySelector(".edit").addEventListener("click", () => {
      document.getElementById("nome").value = jogadora.nome;
      document.getElementById("posicao").value = jogadora.posicao;
      document.getElementById("clube").value = jogadora.clube;
      document.getElementById("foto").value = jogadora.foto;
      document.getElementById("edit-index").value = index;
      document.getElementById("form-title").innerText = "Editar Jogadora";
      document.getElementById("submit-btn").innerText = "Salvar Alterações";
    });

    card.querySelector(".remove").addEventListener("click", () => {
      if (confirm(`Deseja realmente remover ${jogadora.nome}?`)) {
        jogadoras.splice(index, 1);
        salvarDados();
        renderizarCards();
      }
    });

    cardsContainer.appendChild(card);
  });
}

// Formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const posicao = document.getElementById("posicao").value.trim();
  const clube = document.getElementById("clube").value.trim();
  const foto = document.getElementById("foto").value.trim();
  const editIndex = document.getElementById("edit-index").value;

  if (!nome || !posicao || !clube || !foto) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const baseAttr = { pac: 75, sho: 70, pas: 72, dri: 74, def: 70, phy: 72 };

  if (editIndex !== "") {
    const antigos = jogadoras[editIndex];
    jogadoras[editIndex] = { ...antigos, nome, posicao, clube, foto };
    alert("Jogadora editada com sucesso!");
  } else {
    jogadoras.push({ nome, posicao, clube, foto, ...baseAttr, favorita: false });
    alert("Jogadora adicionada com sucesso!");
  }

  salvarDados();
  renderizarCards();
  form.reset();
  document.getElementById("edit-index").value = "";
  document.getElementById("form-title").innerText = "Adicionar Jogadora";
  document.getElementById("submit-btn").innerText = "Adicionar";
  atualizarFiltroTimes();
});

document.getElementById("resetar").addEventListener("click", () => {
  if (confirm("Deseja realmente resetar as jogadoras para os dados iniciais?")) {
    localStorage.removeItem("jogadoras_fifa");
    jogadoras = dadosIniciais;
    salvarDados();
    renderizarCards();
    atualizarFiltroTimes();
  }
});


buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase();
  const filtradas = jogadoras.filter(j => j.nome.toLowerCase().includes(termo) || j.posicao.toLowerCase().includes(termo));
  renderizarCards(filtradas);
});

// Filtro por clube
function atualizarFiltroTimes() {
  const clubes = [...new Set(jogadoras.map(j => j.clube))].sort();
  filtroTime.innerHTML = '<option value="">Todos os clubes</option>';
  clubes.forEach(clube => {
    const option = document.createElement("option");
    option.value = clube;
    option.innerText = clube;
    filtroTime.appendChild(option);
  });
}
filtroTime.addEventListener("change", () => {
  const time = filtroTime.value;
  const filtradas = time ? jogadoras.filter(j => j.clube === time) : jogadoras;
  renderizarCards(filtradas);
});

// Ordenação
ordenarNomeBtn.addEventListener("click", () => {
  jogadoras.sort((a, b) => a.nome.localeCompare(b.nome));
  salvarDados(); renderizarCards();
});
ordenarPosicaoBtn.addEventListener("click", () => {
  jogadoras.sort((a, b) => a.posicao.localeCompare(b.posicao));
  salvarDados(); renderizarCards();
});

// Inicialização
atualizarFiltroTimes();
renderizarCards();
