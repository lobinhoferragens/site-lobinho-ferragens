function normalizarTexto(texto = "") {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function identificarCategoria(produto) {
    const texto = normalizarTexto(
        `${produto.descricao || ""} ${produto.categoria || ""}`
    );

    if (
        texto.includes("parafuso") ||
        texto.includes("porca") ||
        texto.includes("arruela") ||
        texto.includes("bucha") ||
        texto.includes("prego")
    ) {
        return "Fixadores";
    }

    if (
        texto.includes("fio ") ||
        texto.includes("cabo") ||
        texto.includes("tomada") ||
        texto.includes("interruptor") ||
        texto.includes("disjuntor") ||
        texto.includes("eletric")
    ) {
        return "Elétrica";
    }

    if (
        texto.includes("cano") ||
        texto.includes("tubo") ||
        texto.includes("joelho") ||
        texto.includes("registro") ||
        texto.includes("torneira") ||
        texto.includes("hidraul")
    ) {
        return "Hidráulica";
    }

    if (
        texto.includes("martelo") ||
        texto.includes("alicate") ||
        texto.includes("chave") ||
        texto.includes("serrote") ||
        texto.includes("broca") ||
        texto.includes("furadeira") ||
        texto.includes("ferrament")
    ) {
        return "Ferramentas";
    }

    if (
        texto.includes("tinta") ||
        texto.includes("pincel") ||
        texto.includes("rolo") ||
        texto.includes("solvente") ||
        texto.includes("thinner") ||
        texto.includes("oleo")
    ) {
        return "Pintura";
    }

    if (
        texto.includes("cimento") ||
        texto.includes("argamassa") ||
        texto.includes("cal ") ||
        texto.includes("rejunte")
    ) {
        return "Construção";
    }

    if (
        texto.includes("alcool") ||
        texto.includes("detergente") ||
        texto.includes("desinfetante") ||
        texto.includes("limpeza")
    ) {
        return "Limpeza";
    }

    return "Ferragens";
}

function criarImagemCategoria(categoria) {
    const icones = {
        Fixadores: "🔩",
        Elétrica: "⚡",
        Hidráulica: "🚰",
        Ferramentas: "🛠️",
        Pintura: "🎨",
        Construção: "🏗️",
        Limpeza: "🧴",
        Ferragens: "🔧"
    };

    const icone = icones[categoria] || "🔧";

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="350">
            <rect width="100%" height="100%" fill="#f2f4f7"/>

            <text
                x="50%"
                y="43%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="72">
                ${icone}
            </text>

            <text
                x="50%"
                y="68%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="24"
                font-weight="bold"
                fill="#1677ff">
                ${categoria}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function obterImagemProduto(produto) {
    if (
        produto.img &&
        String(produto.img).trim() !== "" &&
        !String(produto.img).includes("via.placeholder.com")
    ) {
        return produto.img;
    }

    const categoria = identificarCategoria(produto);
    return criarImagemCategoria(categoria);
}

function escaparHtml(valor = "") {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const produtosContainer = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

const filtrosCategorias = document.getElementById(
    "filtrosCategorias"
);

const resultadoCatalogo = document.getElementById(
    "resultadoCatalogo"
);

let produtos = [];
let produtosFiltrados = [];

let paginaAtual = 1;
const produtosPorPagina = 12;

let categoriaSelecionada = "Todos";

const paginacaoContainer = document.getElementById("paginacao");

async function carregarProdutos() {
    try {
        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos.json");
        }

        produtos = await resposta.json();
        produtosFiltrados = produtos;

        renderizarProdutos(produtosFiltrados);
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);

        if (produtosContainer) {
            produtosContainer.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <h3>Erro ao carregar os produtos.</h3>
                </div>
            `;
        }
    }
}
function aplicarFiltros() {
    const termoPesquisa = normalizarTexto(
        pesquisa ? pesquisa.value.trim() : ""
    );

    produtosFiltrados = produtos.filter(produto => {
        const descricao = normalizarTexto(
            produto.descricao || ""
        );

        const codigo = normalizarTexto(
            produto.codigo || ""
        );

        const categoria = identificarCategoria(produto);

        const correspondePesquisa =
            descricao.includes(termoPesquisa) ||
            codigo.includes(termoPesquisa);

        const correspondeCategoria =
            categoriaSelecionada === "Todos" ||
            categoria === categoriaSelecionada;

        return correspondePesquisa && correspondeCategoria;
    });

    paginaAtual = 1;

    renderizarProdutos(produtosFiltrados);
}

function renderizarProdutos(lista) {
    if (!produtosContainer) {
        return;
    }

    produtosContainer.innerHTML = "";
if (resultadoCatalogo) {

    const quantidade = lista.length;

    resultadoCatalogo.textContent =
        quantidade === 1
            ? "1 produto encontrado"
            : `${quantidade.toLocaleString("pt-BR")} produtos encontrados`;

}
    if (lista.length === 0) {
        produtosContainer.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <h3>Nenhum produto encontrado.</h3>
            </div>
        `;

        if (paginacaoContainer) {
            paginacaoContainer.innerHTML = "";
        }

        return;
    }

    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;

    const produtosDaPagina = lista.slice(inicio, fim);

    produtosDaPagina.forEach(produto => {
        const codigo = escaparHtml(produto.codigo);
        const descricao = escaparHtml(produto.descricao || "Produto");
        const imagem = obterImagemProduto(produto);

        const card = document.createElement("div");
        card.className = "produto-item";

        card.innerHTML = `
            <div class="product-card">

                <div class="product-image">
                    <img
                        src="${imagem}"
                        alt="${descricao}"
                        loading="lazy"
                    >
                </div>

                <div class="product-info">

                    <div class="product-code">
                        Código: ${codigo}
                    </div>

                    <div class="product-title">
                        ${descricao}
                    </div>

                    <div class="product-buttons">

                        <a
                            href="produto.html?id=${encodeURIComponent(produto.codigo)}"
                            class="btn-produto btn-ver">
                            Ver Produto
                        </a>

                        <a
                            href="https://wa.me/5547999999999?text=${encodeURIComponent(
                                `Olá, gostaria de informações sobre o produto ${produto.codigo} - ${produto.descricao || ""}`
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn-produto btn-whats">
                            WhatsApp
                        </a>

                    </div>

                </div>

            </div>
        `;

        produtosContainer.appendChild(card);
    });

    criarPaginacao(lista.length);
}
function criarPaginacao(totalProdutos) {
    if (!paginacaoContainer) {
        return;
    }

    paginacaoContainer.innerHTML = "";

    const totalPaginas = Math.ceil(
        totalProdutos / produtosPorPagina
    );

    if (totalPaginas <= 1) {
        return;
    }

    const botaoAnterior = document.createElement("button");
    botaoAnterior.textContent = "Anterior";
    botaoAnterior.className = "pagination-button";
    botaoAnterior.disabled = paginaAtual === 1;

    botaoAnterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarProdutos(produtosFiltrados);
            voltarAoCatalogo();
        }
    });

    paginacaoContainer.appendChild(botaoAnterior);

    const inicioPagina = Math.max(1, paginaAtual - 2);
    const fimPagina = Math.min(totalPaginas, paginaAtual + 2);

    for (
        let numeroPagina = inicioPagina;
        numeroPagina <= fimPagina;
        numeroPagina++
    ) {
        const botaoPagina = document.createElement("button");

        botaoPagina.textContent = numeroPagina;
        botaoPagina.className = "pagination-button";

        if (numeroPagina === paginaAtual) {
            botaoPagina.classList.add("active");
        }

        botaoPagina.addEventListener("click", () => {
            paginaAtual = numeroPagina;
            renderizarProdutos(produtosFiltrados);
            voltarAoCatalogo();
        });

        paginacaoContainer.appendChild(botaoPagina);
    }

    const informacao = document.createElement("span");
    informacao.className = "pagination-info";
    informacao.textContent = `${paginaAtual} de ${totalPaginas}`;

    paginacaoContainer.appendChild(informacao);

    const botaoProximo = document.createElement("button");
    botaoProximo.textContent = "Próxima";
    botaoProximo.className = "pagination-button";
    botaoProximo.disabled = paginaAtual === totalPaginas;

    botaoProximo.addEventListener("click", () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarProdutos(produtosFiltrados);
            voltarAoCatalogo();
        }
    });

    paginacaoContainer.appendChild(botaoProximo);
}

function voltarAoCatalogo() {
    const catalogo = document.getElementById("catalogo");

    if (catalogo) {
        catalogo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

if (pesquisa) {
    pesquisa.addEventListener(
        "input",
        aplicarFiltros
    );
}
if (filtrosCategorias) {

    filtrosCategorias.addEventListener("click", evento => {

        const botao = evento.target.closest(".category-filter");

        if (!botao) return;

        categoriaSelecionada = botao.dataset.categoria;

        filtrosCategorias
            .querySelectorAll(".category-filter")
            .forEach(btn => btn.classList.remove("active"));

        botao.classList.add("active");

        aplicarFiltros();

    });

}

carregarProdutos();