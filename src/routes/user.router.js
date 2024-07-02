import { Router } from "express";
const router = Router();
import passport from "passport"; 
import { UserManager } from "../controllers/UserManager.js";
const userManager = new UserManager();

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas"); 
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send("Registro Fallido!");
})

router.get("/:uid", async (req, res) => {
    const { uid } = req.params; 
    try {
      const usuario = await userManager.getUserById(uid);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
      console.log(error);
    }
});
  
  router.post("/:uid/carts/:cid", async (req, res) => {
    const { uid, cid } = req.params;
    try {
      const actualizarUsuario = await userManager.agregarCarritoAlUsuario(
        uid,
        cid
    );
    res.status(200).json({
        message: "Carrito agregado al usuario",
        actualizarUsuario,
    });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
      console.log(error);
    }
});

export default router;