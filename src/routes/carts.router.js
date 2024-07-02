import { Router } from "express";
const router = Router();
import { CartManager } from "../controllers/CartManager.js";
const cartManager = new CartManager();
import { CartModel } from "../daos/mongodb/models/carts.model.js";


router.post("/", async (req, res) => {
    try {
      const carrito = await cartManager.crearCarrito();
      res.status(200).json({ message: "Carrito creado con exito", carrito });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
      console.log(error);
    }
});

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) { 
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {   
        const carrito = await CartModel.findById(cartId);
        if (!carrito) {
            console.log("No existe el carrito con ese ID");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        return res.json(carrito.products);
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"});       
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 
    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);
        res.json({message: "Producto eliminado del carrito correctamente", updatedCart});
    } catch (error) { 
        console.error("Error al eliminar el producto del carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);
        res.json({message: "Cantidad del producto actualizada correctamente", updatedCart});
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;       
        const updatedCart = await cartManager.vaciarCarrito(cartId);
        res.json({message: "Todos los productos del carrito fueron eliminados correctamente", updatedCart});
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

export default router;