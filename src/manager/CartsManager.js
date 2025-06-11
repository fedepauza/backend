import fs from 'fs'

class CartManager {

    constructor(pathFile) {
        this.pathFile = pathFile
    }

    generateNewId(carts){
            if (carts.length > 0 ) {
                return Math.max(...carts.map(c => c.id)) + 1 
            }
            else {
                return 1
            }
    }

    async getCarts() {
        try {
            const fileData = await fs.promises.readFile( this.pathFile , 'utf8' )
            const cart = JSON.parse(fileData)

            return cart

        } catch (error) {
            throw new Error('Error al recuperar los carritos')
        }
    }

    async getCartById(cid) {
        try {
            const fileData = await fs.promises.readFile( this.pathFile , 'utf8' )
            const carts = JSON.parse(fileData)
            const cart = carts.find((e) => e.id == cid)

            if(!cart) throw new Error (`No se encuentra el carrito con el ID: ${cid}`)
            return cart

        } catch (error) {
            throw new Error('Error al recuperar el carrito')
        }
    }

    async createCart(newCart) {
        try {
            const fileData = await fs.promises.readFile( this.pathFile , 'utf8' )
            const carts = JSON.parse(fileData)
            const newID = this.generateNewId(carts)

            const cart = {id: newID , products: [], ...newCart}

            carts.push(cart)

            await fs.promises.writeFile(this.pathFile, JSON.stringify( carts , null , 2 ), 'utf-8')

            return carts

        } catch (error) {
            throw new Error (`Error al crear un nuevo carrito`)
        }
    }

    async addProductToCart( cid , pid ) {
        try {
            const fileData = await fs.promises.readFile( this.pathFile , 'utf8' )
            const carts = JSON.parse(fileData)

            const cartIndex = carts.findIndex( c => c.id === Number(cid) )
            if ( cartIndex === -1 ) throw new Error( `Carrito con el ID: ${cid}, no se encuentra` )
            
            const cart = carts[cartIndex]

            const productsInCart = cart.products.find(p => p.product === Number(pid))

            if(productsInCart){
                productsInCart.quantity += 1 
            } else {
                cart.products.push({ product: pid , quantity: 1 })
            }

            carts[cartIndex] = cart 

            await fs.promises.writeFile(this.pathFile, JSON.stringify( carts , null , 2 ), 'utf-8')

            return cart
            
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`)
        }

    }
}

export default CartManager