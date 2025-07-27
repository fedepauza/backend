const btnAddToCart = document.getElementById('add-to-cart')

btnAddToCart.addEventListener('click', async () => {
    const pid = btnAddToCart.dataset.id
    console.log("Producto ID:", pid)

    const cid = '1'

    
    try {
        const response = await fetch(`/api/cart/${cid}/product/${pid}`, {
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

