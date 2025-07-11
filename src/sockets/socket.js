import ProductManager from "../manager/ProductManager.js";
import path from 'path'
import { fileURLToPath } from "url";

const __filname = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filname)

const productManager = new ProductManager(path.join(__dirname , '../data/products.json'))

export const configureSockets = (io) => {
    io.on('connection' , async(socket) => {
        console.log('Nuevo cliente conectado')

        const products = await productManager.getProducts() 
        socket.emit('products' , products)

        socket.on('new-product' , async(product) => {
            await productManager.addProduct(product)
            
            const updateProduct = await productManager.getProducts()         
            io.emit('products' , updateProduct)
        })

        socket.on('delete-product', async (id) => {
            await productManager.deleteProduct(id)
            
            const updatedProducts = await productManager.getProducts()
            io.emit('products', updatedProducts)
        })

        socket.on('update-product', async (data) => {
            const { id, ...updates } = data
        
            if (!id) {
                console.error("❌ No se proporcionó ID para actualizar")
                return
            }
        
            try {
                await productManager.updateProductById(id, updates)
                const updatedProducts = await productManager.getProducts()
                io.emit('products', updatedProducts)
            } catch (error) {
                console.error("❌ Error al actualizar producto:", error.message)
            }
        })

        socket.on('disconnect' , () => {
            console.log('Usuario desconectado')
        })

    })
}