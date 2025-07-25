import { Router  } from "express";
import { uploader } from '../middlewares/multerConfig.js'
import multer from "multer";
import ProductManager from "../manager/ProductManager.js";
import path from 'path'
import Product from "../models/product.model.js";

const productRouter = Router()
const productManager = new ProductManager(path.resolve('src/data/products.json'))
const upload = multer({ dest: 'public/uploads' }) 



productRouter.get("/" , async ( req , res ) => {
    try {
        const products = await Product.find()
        res.status(200).json({status: "success" , payload: products})
    } catch (error) {
        res.status(500).json({status: "error" , message: "Error al recuperar los productos "})
    }
})

productRouter.get("/api/products" , async ( req , res ) => {
    try {
        const products = await productManager.getProducts()
        res.status(200).json({ status: "Success" , products })
    } catch (error) {
        res.status(500).json({ status: "Error" , message: "Error al recibir los productos"})
    }
})

productRouter.get("/api/products/:pid" , async ( req , res ) => {
    try {
        const pid = req.params.pid
        const product = await productManager.getProductById(pid)
        res.status(200).json({ status: "Succes" , product})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error" , message: "Erro al encontrar el producto"})
    }
})

productRouter.post("/api/products" , async ( req , res ) => {
    try {
        const { title , price , stock , description } = req.body
        const product = new Product({ title , price , stock , description })
        await product.save()
        res.status(201).json({ status: "Success" , payload: product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error" , message: "Error al agregar el producto nuevo"})
    }
})


productRouter.put("/api/products/:pid" , async ( req , res ) => {
    try {
        const pid = req.params.pid
        const updateData = req.body
        const updateProduct = await Product.findOneAndUpdate(pid , updateData, { new: true , runValidators: true })
        if(!updateProduct) return res.status(404).json({ status: "Error" , message: "Producto no encontrado"})
        res.status(201).json({ status: "Success" , payload: updateProduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error" , message: "Error al actualizar producto"})
    }
} )


productRouter.delete("/api/products/:pid" , async ( req , res ) => {
    try {
        const pid = req.params.pid
        const deletedProduct = await Product.findByIdAndDelete(pid)
        if(!deletedProduct) return res.status(404).json({ status: "Error" , message: "Producto no encontrado"})
        res.status(201).json({ status: "Success" , payload: deletedProduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error" , message: "Error al eliminar el producto"})
    }
})

productRouter.post('/upload', uploader.single('thumbnails'), (req, res) => {
    if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' })
    }

    const imagePath = `/uploads/${req.file.filename}`
    res.status(200).json({ status: 'success', path: imagePath })
})

productRouter.post('/form/:id', upload.single('thumbnails'), async (req, res) => {
    const { id } = req.params
    const updates = req.body
    if (req.file) {
        updates.thumbnails = `/uploads/${req.file.filename}`
    }
    
    try {
        await productManager.updateProductById(parseInt(id), updates)
        res.redirect('/home')
    } catch (err) {
        res.status(500).send("Error al actualizar el producto")
    }
})



export default productRouter