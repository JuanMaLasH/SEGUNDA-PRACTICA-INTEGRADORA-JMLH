import UserModel  from "../daos/mongodb/models/user.model.js";

export class UserManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getUserById(userId) {
    try {    
      const usuarioEncontrado = await UserModel.findById(userId);
      if (!usuarioEncontrado) {
        console.log("No se encontro el usuario");
        return null;
      }
      return usuarioEncontrado;
    } catch (error) {
      console.log("Error al encontrar el usuario", error);
    }
  }

  async agregarCarritoAlUsuario(userId, cartId) {
    try {
      const usuario = await this.getUserById(userId);
      if (!usuario) {
        console.log("El usuario no existe");
        return null;
      }
      if (usuario.cartId && usuario.cartId.toString() === cartId) {
        console.log("El usuario ya tiene este carrito");
        return null;
      }
      usuario.cartId = cartId;
      await usuario.save();
      return usuario;
    } catch (error) {
      console.log("Error al agregar el carrito al usuario", error);
    }
  }
}
