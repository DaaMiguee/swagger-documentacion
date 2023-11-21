import { cartModel } from '../../mongoDB/models/carts.model.js';
import BasicManager from './basic.manager.dao.js'
import loguer from '../../../winston.js';

class CartsManager extends BasicManager {
    constructor() {
        super(cartModel, 'products.product');
    }
    async addProduct(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return loguer.error("Cart not found");
            }
            const productExists = cart.products.some(p => p.product.equals(pid));
            if (!productExists) {
                cart.products.push({ product: pid, quantity: 1 });
            } else {
                const product = cart.products.find(p => p.product.equals(pid));
                product.quantity++;
            }
            const updateCart = await cart.save();
            return updateCart;
        } catch (error) {
            return error;
        }
    }

    async updateCartProducts(cid, newProducts) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = newProducts;
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            const product = cart.products.find(productObj => productObj.product.toString() === productId);
            if (!product) {
                throw new Error("Product not found in the cart");
            }
            product.quantity = newQuantity;
            await cart.save();
            return cart;
        } catch (error) {
            return error;
        }
    }
    async delProduct(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products = cart.products.filter(product => !product.product.equals(pid));
            await cart.save();
            return cart;
        } catch (error) {
            return error;
        }
    }
    async createCartUser(uid) {
        try {
            // Crear un nuevo carrito vacío y asociarlo al usuario
            const newCart = new cartModel({
                user: uid, // Asocia el carrito al usuario recién registrado
                products: [], // Inicialmente, el carrito está vacío
            });
            await newCart.save();
            return newCart
        } catch (error) {
            return error;
        }
    }
}

export const cartsManager = new CartsManager();