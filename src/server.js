const express = require('express');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const path =  require('path');


const Contenedor = require('./managers/container');
const ContenedorChat = require('./managers/containerChat')

let container = new Contenedor('products.txt');
let chatContainer = new ContenedorChat('chat.txt');

const viewsFolder = path.join(__dirname,"views");

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, ()=>console.log(`Server Port ${PORT}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"))

app.engine("handlebars", handlebars.engine());

app.set("views", viewsFolder);

app.set("view engine", "handlebars");

const io = new Server(server);


io.on("connection", async(socket)=>{
    console.log("Nuevo cliente conectado");
    const chat = await chatContainer.getAll();
    socket.emit("messagesChat", chat);
    const products = await container.getAll();
    socket.emit("products", products);

    socket.on("newMsg", async(data)=>{
        await chatContainer.save(data)
        const chat = await chatContainer.getAll();
        io.sockets.emit("messagesChat", chat)
    })

    socket.on("newProduct", async(data)=>{
        await container.save(data)
        const products = await container.getAll();
        io.sockets.emit("products", products)
    })
})

app.get('/', (req,res) => {
    res.render("home")
})