import mongoose from "mongoose"
import dotenv from 'dotenv'

const connectMongoDb = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB)
        console.log("Conectado con MongoDB")
    } catch (error) {
        console.error("Error al conectar con MongoDB")
    }
}

export default connectMongoDb