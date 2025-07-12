const socket = io()
let currentProducts = []

const form = document.getElementById('product-form')
const productList = document.getElementById('product-list')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    try {
        const uploadRes = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData
        })

        const uploadData = await uploadRes.json()

        if (!uploadData.path) {
        return console.error('❌ No se pudo subir la imagen')
        }

        const newProduct = {
        title: formData.get('title'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        thumbnails: uploadData.path
        }

        socket.emit('new-product', newProduct)
        form.reset()
    } catch (error) {
        console.error('❌ Error al subir imagen o enviar producto', error)
    }
    })

    socket.on('products', (products) => {
    currentProducts = products
    productList.innerHTML = ''

    products.forEach(p => {
        const card = document.createElement('div')
        card.classList.add('product-lists')
        card.innerHTML = `
        <h3>${p.title}</h3>
        <p>Precio: $${p.price}</p>
        <p>Categoría: ${p.category}</p>
        <a href="/edit/${p.id}" class="edit-link">Editar</a>
        <button data-id="${p.id}" class="delete-btn">Eliminar</button>
        `
        productList.appendChild(card)
    })


    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')
        console.log('Boton eliminar' , id)
        socket.emit('delete-product', parseInt(id))
        })
    })
    })

    document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.getAttribute('data-id'))
        const product = currentProducts.find(p => p.id === id)
        if (!product) return

        document.getElementById('edit-id').value = product.id
        document.getElementById('edit-title').value = product.title
        document.getElementById('edit-price').value = product.price
        document.getElementById('edit-category').value = product.category
        document.getElementById('edit-description').value = product.description
        document.getElementById('edit-stock').value = product.stock
        document.getElementById('edit-thumbnails').value = product.thumbnails

        document.getElementById('edit-container').style.display = 'block'
    }
    })

    document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-container').style.display = 'none'
    })

    document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const id = parseInt(document.getElementById('edit-id').value)
    if (!id) {
        return console.error("❌ No se proporcionó ID para actualizar")
    }

    const updatedProduct = {
        title: document.getElementById('edit-title').value,
        price: parseFloat(document.getElementById('edit-price').value),
        category: document.getElementById('edit-category').value,
        description: document.getElementById('edit-description').value,
        stock: parseInt(document.getElementById('edit-stock').value),
        thumbnails: document.getElementById('edit-thumbnails').value
    }

    socket.emit('update-product', { id, ...updatedProduct })

    document.getElementById('edit-form').reset()
    // document.getElementById('edit-container').style.display = 'none'
})
