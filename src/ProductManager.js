
import fs from 'fs'

class ProductManager {
    constructor(pathFile) {
        this.pathFile = pathFile
    }

    async getProducts() {
        try {
            const fileData = await fs.promises.readFile(this.pathFile , 'utf-8')
            const products = JSON.parse(fileData)

            return products
        } catch (error) {
            throw new Error ('Error al mostrar los productos')
        }
    }

    generateNewID(products) {
        if(products.length > 0) {
            return products[ products.length - 1 ].id + 1
        } else {
            return 1
        }
    }

    async addProduct(newProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile , 'utf-8')
            const products = JSON.parse(fileData)
            const newID = this.generateNewID(products)

            const product = {id: newID , ...newProduct}

            products.push(product)

            await fs.promises.writeFile(this.pathFile, JSON.stringify( products , null , 2 ) , 'utf-8')
            return products

        } catch (error) {
            throw new Error (`Error al agregar un nuevo producto`)
        }
    }

    async deleteProduct(idProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile , 'utf-8')
            const products = JSON.parse(fileData)
            const productIndex = products.findIndex((p) => p.id === parseInt(idProduct))

            if ( productIndex === -1) throw new Error ( `Producto con el ID: ${idProduct}, no pudo ser encontrado` )
                products.splice( productIndex , 1 )

            await fs.promises.writeFile(this.pathFile, JSON.stringify( products , null , 2 ) , 'utf-8')
            return products

        } catch (error) {
            throw new Error (`Error al eliminar el producto: ${error.message}`)
        }
    }

    async updateProductById(idProduct , updateProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile , 'utf-8')
            const products = JSON.parse(fileData)
            const productIndex = products.findIndex((p) => p.id === parseInt(idProduct))
            
            if ( productIndex === -1) throw new Error ( `Producto con el ID: ${idProduct}, no pudo ser encontrado` )

            products[productIndex] = { ...products[productIndex] , ...updateProduct }

            await fs.promises.writeFile(this.pathFile, JSON.stringify( products , null , 2 ) , 'utf-8')
            return products

        } catch (error) {
            throw new Error (`Error al actualizar el producto: ${error.message}`)
        }
    }

    async getProductById(idProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile , 'utf-8')
            const products = JSON.parse(fileData)
            const product = products.find((p) => p.id === parseInt(idProduct))

            if (!product) throw new Error ( `No se encontro el producto con el ID: ${idProduct}` )
            return product

        } catch (error) {
            throw new Error (`Error al encontrar el producto: ${error.message}`)
        }
    }

}

export default ProductManager