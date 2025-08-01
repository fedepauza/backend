import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String, 
    price: Number,
    description: String, 
    stock: Number,
    status: { type: Boolean, default: true},
    created_at: {type: Date, default: Date.now()}
})

const Product = mongoose.model("Product" , productSchema)

export default Product