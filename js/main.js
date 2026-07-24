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
                        src="${produto.img || 'https://via.placeholder.com/300x300?text=Sem+Imagem'}"
                        alt="${produto.descricao}"
                        onerror="this.src='https://via.placeholder.com/300x300?text=Sem+Imagem'">

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