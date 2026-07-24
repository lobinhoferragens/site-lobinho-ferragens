function normalizarTexto(texto = "") {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function escaparHtml(valor = "") {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
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
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
            <rect width="100%" height="100%" fill="#f2f4f7"/>

            <text
                x="50%"
                y="42%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="120">
                ${icone}
            </text>

            <text
                x="50%"
                y="67%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="42"
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

    return criarImagemCategoria(
        identificarCategoria(produto)
    );
}

function obterCodigoDaUrl() {
    const parametros = new URLSearchParams(
        window.location.search
    );

    return parametros.get("id");
}

async function carregarProduto() {
    const container = document.getElementById(
        "produtoDetalhes"
    );

    if (!container) {
        console.error(
            "O elemento #produtoDetalhes não foi encontrado."
        );

        return;
    }

    try {
        const codigo = obterCodigoDaUrl();

        if (!codigo) {
            throw new Error(
                "Código do produto não informado."
            );
        }

        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar os produtos."
            );
        }

        const produtos = await resposta.json();

        const produto = produtos.find(item => {
            return String(item.codigo) === String(codigo);
        });

        if (!produto) {
            throw new Error("Produto não encontrado.");
        }

        renderizarProduto(produto);

        renderizarProdutosRelacionados(
            produto,
            produtos
        );
    } catch (erro) {
        console.error(erro);

        container.innerHTML = `
            <div class="product-detail-error">
                <i class="fa-solid fa-circle-exclamation"></i>

                <h1>Produto não encontrado</h1>

                <p>
                    Não foi possível carregar as informações
                    deste produto.
                </p>

                <a
                    href="index.html#catalogo"
                    class="product-back-link"
                >
                    Voltar ao catálogo
                </a>
            </div>
        `;
    }
}

function renderizarProduto(produto) {
    const container = document.getElementById(
        "produtoDetalhes"
    );

    if (!container) {
        return;
    }

    const codigo = escaparHtml(produto.codigo);

    const descricao = escaparHtml(
        produto.descricao || "Produto"
    );

    const categoria = identificarCategoria(produto);
    const imagem = obterImagemProduto(produto);

    const mensagemWhatsApp = encodeURIComponent(
        `Olá, gostaria de informações sobre o produto ${produto.codigo} - ${produto.descricao || ""}`
    );

    document.title =
        `${produto.descricao || "Produto"} | Lobinho Ferragens`;

    container.innerHTML = `
        <div class="product-detail-image-area">

            <div class="product-detail-category">
                ${categoria}
            </div>

            <img
                src="${imagem}"
                alt="${descricao}"
                class="product-detail-image"
            >

        </div>

        <div class="product-detail-info">

            <span class="product-detail-code">
                Código: ${codigo}
            </span>

            <h1>
                ${descricao}
            </h1>

            <p class="product-detail-description">
                Consulte disponibilidade, especificações
                e condições comerciais diretamente com
                nossa equipe.
            </p>

            <div class="product-detail-meta">

                <div>
                    <span>Categoria</span>
                    <strong>${categoria}</strong>
                </div>

                <div>
                    <span>Atendimento</span>
                    <strong>WhatsApp</strong>
                </div>

            </div>

            <div class="product-detail-actions">

                <a
                    href="https://wa.me/5547999999999?text=${mensagemWhatsApp}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="product-detail-whatsapp"
                >
                    <i class="fa-brands fa-whatsapp"></i>
                    Solicitar informações
                </a>

                <a
                    href="index.html#catalogo"
                    class="product-detail-back"
                >
                    <i class="fa-solid fa-arrow-left"></i>
                    Voltar ao catálogo
                </a>

                <button
                    type="button"
                    id="btnCompartilharProduto"
                    class="product-detail-share"
                >
                    <i class="fa-solid fa-share-nodes"></i>
                    Compartilhar produto
                </button>

            </div>

        </div>
    `;

    configurarCompartilhamento(produto);
}

function configurarCompartilhamento(produto) {
    const botao = document.getElementById(
        "btnCompartilharProduto"
    );

    if (!botao) {
        return;
    }

    botao.addEventListener("click", async () => {
        const titulo =
            produto.descricao || "Produto";

        const texto =
            `Confira este produto na Lobinho Ferragens: ${titulo}`;

        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: titulo,
                    text: texto,
                    url: url
                });

                return;
            }

            await copiarTexto(url);

            mostrarAvisoCompartilhamento(
                botao,
                "Link copiado!"
            );
        } catch (erro) {
            if (erro.name === "AbortError") {
                return;
            }

            console.error(
                "Não foi possível compartilhar:",
                erro
            );

            mostrarAvisoCompartilhamento(
                botao,
                "Não foi possível copiar"
            );
        }
    });
}

async function copiarTexto(texto) {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(texto);
        return;
    }

    const campoTemporario =
        document.createElement("textarea");

    campoTemporario.value = texto;
    campoTemporario.style.position = "fixed";
    campoTemporario.style.left = "-9999px";
    campoTemporario.style.top = "0";

    document.body.appendChild(campoTemporario);

    campoTemporario.focus();
    campoTemporario.select();

    const copiado = document.execCommand("copy");

    campoTemporario.remove();

    if (!copiado) {
        throw new Error(
            "O navegador não permitiu copiar o link."
        );
    }
}

function mostrarAvisoCompartilhamento(
    botao,
    mensagem
) {
    const conteudoOriginal = botao.innerHTML;

    botao.innerHTML = `
        <i class="fa-solid fa-check"></i>
        ${mensagem}
    `;

    botao.disabled = true;

    setTimeout(() => {
        botao.innerHTML = conteudoOriginal;
        botao.disabled = false;
    }, 2000);
}

function renderizarProdutosRelacionados(
    produtoAtual,
    produtos
) {
    const categoriaAtual = identificarCategoria(
        produtoAtual
    );

    const relacionados = produtos
        .filter(produto => {
            return (
                String(produto.codigo) !==
                    String(produtoAtual.codigo) &&
                identificarCategoria(produto) ===
                    categoriaAtual
            );
        })
        .slice(0, 3);

    if (relacionados.length === 0) {
        return;
    }

    const secao = document.getElementById(
        "produtosRelacionadosSecao"
    );

    const container = document.getElementById(
        "produtosRelacionados"
    );

    if (!secao || !container) {
        return;
    }

    container.innerHTML = "";

    relacionados.forEach(produto => {
        const codigo = escaparHtml(produto.codigo);

        const descricao = escaparHtml(
            produto.descricao || "Produto"
        );

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
                            class="btn-produto btn-ver"
                        >
                            Ver Produto
                        </a>

                    </div>

                </div>

            </div>
        `;

        container.appendChild(card);
    });

    secao.hidden = false;
}

carregarProduto();