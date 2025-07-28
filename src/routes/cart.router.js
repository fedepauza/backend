import { Router  } from "express";
import CartsManager from "../manager/CartsManager.js";
import ProductManager from "../manager/ProductManager.js";
import path from 'path'

const router = Router()
const cartManager = new CartsManager(path.resolve('src/data/cart.json'))
const productManager = new ProductManager(path.resolve('src/data/products.json'));


// Crea un nuevo carrito 

router.post("/" , async ( req , res ) => {
    try {
        const cart = await cartManager.createCart()
        res.status(201).json({ status: "Success" , cart})
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al crear el nuevo carrito"})
    }
})

// Trae un carrito por su ID

router.get("/:cid" , async ( req , res ) => {
    try {
        const cid = req.params.cid
        const cart = await cartManager.getCartById(cid)

        res.render( 'cart' , {cart})
        res.status(200).json({ status: "Succes" , cart})
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al encontrar el carrito"})
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
      console.log("Buscando carrito con ID:", cid);
      const cart = await cartManager.getCartById(cid);
      console.log("Carrito encontrado:", cart);
  
      console.log("Buscando producto con ID:", pid);
      const product = await productManager.getProductById(pid);
      console.log("Producto encontrado:", product);
  
      const updatedCart = await cartManager.addProductToCart(cid, pid);
      console.log("Carrito actualizado:", updatedCart);
  
      return res.status(201).json({
        status: "Success",
        message: "Producto agregado al carrito",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("❌ Error en POST /:cid/product/:pid:", error);
      res.status(500).json({ status: "Error", message: "Error al agregar producto al carrito" });
    }
  });
  

export default router