const produtosContainer = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

let produtos = [];
let produtosFiltrados = [];

async function carregarProdutos() {

    try {

        const resposta = await fetch("produtos.json");

        produtos = await resposta.json();

        produtosFiltrados = produtos;

        renderizarProdutos(produtos);

    } catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

    }

}
function renderizarProdutos(lista) {

    produtosContainer.innerHTML = "";

    lista.forEach(produto => {

        produtosContainer.innerHTML += `

        <div class="col-lg-4 col-md-6">

            <div class="product-card">

                <div class="product-image">

                    <img src="${produto.imagem}" alt="${produto.nome}">

                </div>

                <div class="product-info">

                    <div class="product-code">
                        Código: ${produto.codigo}
                    </div>

                    <div class="product-title">
                        ${produto.nome}
                    </div>

                    <div class="product-description">
                        ${produto.descricao}
                    </div>

                    <div class="product-price">
                        R$ ${produto.preco.toFixed(2).replace(".", ",")}
                    </div>

                    <div class="product-buttons">

                        <button
                            class="btn-produto btn-ver"
                            onclick="verProduto(${produto.id})">

                            Ver Produto

                        </button>

                        <button
                            class="btn-produto btn-whats"
                            onclick="pedirWhatsapp('${produto.nome}')">

                            WhatsApp

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}
function verProduto(id){

    window.location.href = `produto.html?id=${id}`;

}

function pedirWhatsapp(nome){

    const telefone = "5547999999999"; // <-- coloque o número da Lobinho

    const mensagem =
        encodeURIComponent(
            `Olá! Tenho interesse no produto: ${nome}`
        );

    window.open(
        `https://wa.me/${telefone}?text=${mensagem}`,
        "_blank"
    );

}
carregarProdutos();