import express from 'express'
import ProductManager from './manager/ProductManager.js'
// import CartManager from './manager/CartsManager.js'

const app = express()
app.use(express.json())
    
const productManager = new ProductManager('src/data/products.json')
// const cartManager = new CartManager('./data/cart.json')


    app.get("/" , ( req , res ) => {
        res.json({ message:'Hola Mundo' })
    })

    app.get("/api/products" , async ( req , res ) => {
        try {
            const products = await productManager.getProducts()
            res.status(200).json({ status: "Success" , products })
        } catch (error) {
            res.status(500).json({ status: "Error" , message: "Error al recibir los productos"})
        }
    })

    app.get("/api/products/:pid" , async ( req , res ) => {
        try {
            const pid = req.params.pid
            const product = await productManager.getProductById(pid)
            res.status(200).json({ status: "Succes" , product})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "Error" , message: "Erro al encontrar el producto"})
        }
    })

    app.post("/api/products" , async ( req , res ) => {
        try {
            const newProduct = req.body
            const products = await productManager.addProduct(newProduct)
            res.status(201).json({ status: "Success" , products })
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "Error" , message: "Error al agregar el producto nuevo"})
        }
    })

    app.put("/api/products/:pid" , async ( req , res ) => {
        try {
            const pid = req.params.pid
            const updateProduct = req.body
            const products = await productManager.updateProductById(pid , updateProduct)
            res.status(201).json({ status: "Success" , products})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "Error" , message: "Error al actualizar producto"})
        }
    } )

    app.delete("/api/products/:pid" , async ( req , res ) => {
        try {
            const pid = req.params.pid
            const products = await productManager.deleteProduct(pid)
            res.status(201).json({ status: "Success" , products})
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: "Error" , message: "Error al eliminar el producto"})
        }
    })

app.listen( 8080 , () => {
    console.log("Servidor funcionando correctamente ✅")
})