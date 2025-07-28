const btn = document.getElementById('add-to-cart');

btn?.addEventListener('click', async () => {
  const pid = btn.dataset.id;
  const cid = '1'; // Asegurate que este carrito con ID 1 exista en tu JSON o base de datos

  if (!pid) {
    console.error('El ID del producto no está definido en el botón.');
    return;
  }

  try {
    const response = await fetch(`/api/cart/${cid}/product/${pid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta del servidor con error:', errorText);
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Producto agregado con éxito al carrito:', data);
    } else {
      const text = await response.text();
      throw new Error(`La respuesta no es JSON: ${text}`);
    }

  } catch (err) {
    console.error('❌ Error al intentar agregar el producto al carrito:', err.message);
  }
});
