import express from 'express';
import handlebars from "express-handlebars";
import session from "express-session";
import { Server } from "socket.io"; 
import MongoStore from "connect-mongo";
import passport from 'passport';
import { initializePassport  } from "./config/passport.config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import userRouter from "./routes/user.router.js"
import { initMongoDB } from './db/database.js';

const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//SESSION
app.use(session({
    secret:"secretCoder",
    resave: true,
    saveUninitialized : true, 
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/ecommerce", ttl: 10000
    })
}))

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
initializePassport(); 

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

initMongoDB();

//LISTEN
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`SERVER UP ON PORT ${PORT}`);
});

const socketServer = new Server(httpServer);

import { ProductManager } from "./controllers/ProductManager.js";
const productServices = new ProductManager(); 
import ChatManager from "./daos/mongodb/message.dao.js";
const messageServices = new ChatManager();

socketServer.on("connection", async (socket) => {
    console.log("Un cliente conectado");
    
    const listProducts = await productServices.getProducts();
    socket.emit("productos", listProducts);

    socket.on("create", async (producto) => {
      await productServices.create(producto);
      const listProducts = await productServices.getProducts();
      socket.emit("productos", listProducts);
  })

    socket.on("delete", async (id) => {
        await productServices.delete(id);
        const listProducts = await productServices.getProducts();
        socket.emit("productos", listProducts);
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
      });
      socket.on("newUser", (usuario) => {
        console.log("usuario", usuario);
        socket.broadcast.emit("broadcast", usuario);
      });
    
      socket.on("disconnect", () => {
        console.log(`Usuario con ID : ${socket.id} esta desconectado `);
      });
    
      socket.on("message", async (info) => {
        console.log(info);
        await messageServices.createMessage(info);
        socketServer.emit("chat", await messageServices.getMessages());
      });
});