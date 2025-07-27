import { Router  } from "express";
import path from 'path'
import __dirname from "../utils.js";
import ProductManager from "../manager/ProductManager.js";

const router = Router()
const productManager = new ProductManager(path.join(__dirname , 'data/products.json'))

router.get('/home', async ( req , res ) => {
    const products = await productManager.getProducts()
    console.log(products)
    res.render('home' , { title: "Productos disponibles" , products , currentPage: 'home' }) 
} )

router.get('/realTimeProducts' , ( req , res ) => {
    res.render('realTimeProducts' , {title: "Manejador de productos"})
})

router.get('/cart' , ( req , res ) => {
    res.render('cart' , {title: "Carrito de compras" , isCartPage: 'cart'})
})

router.get('/description/:pid' , async ( req , res ) => {
    const { pid } = req.params

    try {
        const product = await productManager.getProductById(pid)
        if (!product) return res.status(404).send("Producto no encontrado")
        res.render('description' , {title: "Info del producto" , product})
    } catch (error) {
        res.status(500).send("Error al buscar producto")
    }
})

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    try {
        const product = await productManager.getProductById(id)
        if (!product) return res.status(404).send("Producto no encontrado")
        res.render('updateProduct', { product }) 
    } catch (error) {
        res.status(500).send("Error al buscar producto")
    }
})

export default router
