const btnAddToCart = document.getElementById('add-to-cart')

btnAddToCart.addEventListener('click', async () => {
    const productId = btnAddToCart.dataset.id
    const cartId = '64eac9e8e3d4f6c14b78fc0f'

    
    try {
        const response = await fetch(`/api/cart/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(async res => {
                const contentType = res.headers.get('content-type')
                if (!res.ok) {
                const errorText = await res.text()
                console.error("Respuesta del servidor:", errorText);
                throw new Error(`Error HTTP ${res.status}: ${errorText}`)
                }
                if (contentType && contentType.includes('application/json')) {
                return res.json()
                } else {
                const text = await res.text()
                throw new Error(`Respuesta no es JSON: ${text}`)
                }
            })
            .then(data => console.log("Agregado con éxito", data))
            .catch(err => console.error("Error al agregar al carrito:", err))
    } 
    catch {
        console.error("Error al agregar al carrito:");
    }} )

