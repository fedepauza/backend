const socket = io()

const productList = document.getElementById('product-list')

socket.on('products', (products) => {
    productList.innerHTML = ''
    products.forEach(p => {
        const card = document.createElement('div')
        card.classList.add('product-card')
        card.innerHTML = `
            <a href="/description/${p.id}">
            <h3>${p.title}</h3>
            <p>Precio: $${p.price}</p>
            <p>Categoría: ${p.category}</p>
            <p>Descripción: ${p.description}</p>
            <p>Stock: ${p.stock}</p>
            <img src="${p.thumbnails}" alt="Imagen de ${p.title}" width="150" />
            </a>
        `
        productList.appendChild(card)
    })
})

