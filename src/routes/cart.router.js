import { Router  } from "express";
import CartsManager from "../manager/CartsManager.js";
import path from 'path'

const router = Router()
const cartManager = new CartsManager(path.resolve('src/data/cart.json'))

// Crea un nuevo carrito 

router.post("/api/cart" , async ( req , res ) => {
    try {
        const cart = await cartManager.createCart()
        res.status(201).json({ status: "Success" , cart})
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al crear el nuevo carrito"})
    }
})

// Trae un carrito por su ID

router.get("/api/cart/:cid" , async ( req , res ) => {
    try {
        const cid = req.params.cid
        const cart = await cartManager.getCartById(cid)

        res.status(200).json({ status: "Succes" , cart})
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al encontrar el carrito"})
    }
})

router.post("/api/cart/:cid/product/:pid" , async ( req , res ) => {
    const { cid , pid } = req.params
    try {
        const cart = await cartManager.getCartById( cid )
        await productManager.getProductById( pid )

        const updatedCart = await cartManager.addProductToCart( cid , pid )

        res.status(201).json({ status: "Success" , cart: updatedCart })
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al agregar producto al carrito"})
    }
})

export default router