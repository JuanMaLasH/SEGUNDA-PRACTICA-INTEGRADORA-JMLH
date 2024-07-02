import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId, 
                ref: "products",
                required: true
            },
            quantity: {
                type:Number, 
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usuarios",
    }
})

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});

export const CartModel = model("carts", cartSchema);
