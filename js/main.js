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