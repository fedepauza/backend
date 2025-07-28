import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import * as path from 'path'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import {configureSockets} from './sockets/socket.js'
import methodOverride from 'method-override'
import connectMongoDb from './config/db.js'
import dotenv from 'dotenv'

const app = express()

connectMongoDb()

// Middleware

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname , 'public')))
app.use(methodOverride('_method'))

// Handlebars

app.engine("handlebars" , engine())
app.set("view engine" , "handlebars" )
app.set("views" , path.resolve(__dirname , 'views') )

// Routes

app.use('/api/products' , productsRouter)
app.use('/api/cart' , cartsRouter)
app.use('/', viewsRouter)


// Main Route

app.get('/' , ( req , res ) => {
    res.render('home' , { title: "Home"})
})




// Socket.io + Servidor 

const httpServer = app.listen( 8080 , () => {
    console.log("Servidor funcionando correctamente ✅")
})

const io = new Server(httpServer)

configureSockets(io)