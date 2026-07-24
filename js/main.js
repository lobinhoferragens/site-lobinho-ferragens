function criarImagemPadrao(texto = "Sem imagem") {
    const textoSeguro = String(texto)
        .slice(0, 25)
        .replace(/[<>&"'`]/g, "");

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
            <rect width="100%" height="100%" fill="#f2f4f7"/>

            <text
                x="50%"
                y="47%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="18"
                fill="#6b7280">
                Produto sem imagem
            </text>

            <text
                x="50%"
                y="57%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="13"
                fill="#9ca3af">
                ${textoSeguro}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
const produtosContainer = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

let produtos = [];
let produtosFiltrados = [];

async function carregarProdutos() {
    try {
        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos.json");
        }

        produtos = await resposta.json();

        console.log(produtos);

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

function renderizarProdutos(lista) {

    produtosContainer.innerHTML = "";

    if (lista.length === 0) {
        produtosContainer.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <h3>Nenhum produto encontrado.</h3>
            </div>
        `;
        return;
    }

    lista.forEach(produto => {

        const card = document.createElement("div");
        card.className = "produto-item";
        card.innerHTML = `
            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${produto.img || criarImagemPadrao(produto.descricao)}"
                        alt="${produto.descricao}"
                        loading="lazy">
                        onerror="this.onerror=null; this.src=criarImagemPadrao('Sem imagem');"

                </div>

                <div class="product-info">

                    <div class="product-code">
                        Código: ${produto.codigo}
                    </div>

                    <div class="product-title">
                        ${produto.descricao}
                    </div>

                    <div class="product-buttons">

                        <a
                            href="produto.html?id=${produto.codigo}"
                            class="btn-produto btn-ver">
                            Ver Produto
                        </a>

                        <a
                            href="https://wa.me/5547999999999?text=Olá, gostaria de informações sobre o produto ${produto.codigo}"
                            target="_blank"
                            class="btn-produto btn-whats">
                            WhatsApp
                        </a>

                    </div>

                </div>

            </div>
        `;

        produtosContainer.appendChild(card);

    });

}

if (pesquisa) {

    pesquisa.addEventListener("input", () => {

        const texto = pesquisa.value.toLowerCase();

        produtosFiltrados = produtos.filter(produto => {

            return (
                produto.descricao.toLowerCase().includes(texto) ||
                produto.codigo.toString().includes(texto)
            );

        });

        renderizarProdutos(produtosFiltrados);

    });

}

carregarProdutos();