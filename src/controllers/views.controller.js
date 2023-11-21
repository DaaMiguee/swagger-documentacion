import { productService } from "../services/products.service.js";
import { productManager } from "../DAL/DAOs/MongoDAOs/products.manager.dao.js";
import { cartsManager } from "../DAL/DAOs/MongoDAOs/carts.manager.dao.js";
import { generateProduct } from "../mocks.js";
import config from "../config/config.js"
import jwt from "jsonwebtoken"
import { userService } from "../services/users.service.js";

const realtimeproducts = async (req, res) => {
    try {
        const { info } = await productService.findAll({});
        if (!info.payload.length) {
            return res.status(404).send({ message: "Real-time Products not found" });
        }
        res.render("realTimeProducts", { 
            products: info.payload, 
            user: res.locals.user, 
            onlyAdmin: res.locals.isAdmin, 
            isPremium: res.locals.isPremium});
    } catch (error) {
        res.status(500).json({ error });
    }
}
const allProducts = async (req, res) => {
    const limit = req.query.limit;
    if (limit && isNaN(limit) || limit <= 0) {
        return res.send({ message: "Invalid limit. Must be an integer" });
    }
    try {
        const { info } = await productService.findAll({ limit });
        if (!info.payload.length) {
            return res.status(404).send({ message: "Products not found" });
        }
        res.render("home", { 
            products: info.payload, 
            user: res.locals.user, 
            onlyAdmin: res.locals.isAdmin });
    } catch (error) {
        res.status(500).json({ error });
    }
}
const oneProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.findById(pid);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        };
        res.status(200).render("home", { product });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const viewAllProducts = async (req, res) => {
    const cartIdUser = req.session.user ? req.session.user.cart : (res.locals.user ? res.locals.user.cart : null);
    const page = req.query.page || 1;
    const limit = 10;
    try {
        const productsData = await productService.findAll({ page, limit });
        const isAdmin = res.locals.user && res.locals.user.role === 'admin';
        const premiumRole = res.locals.user && res.locals.user.role === 'premium';
        return res.render('productsView', {
            products: productsData.info.payload,
            pagination: productsData.info,
            user: res.locals.user,
            cartId: cartIdUser,
            onlyAdmin: isAdmin,
            isPremium: premiumRole
        });
    } catch (error) {
        res.status(500).send({ error });
    }
}

const viewOneCart = async (req, res) => {
    const { cid } = req.params;
    if (!cid) {
        res.status(400).send({ message: "Cart ID not found" })
    }
    try {
        const cart = await cartsManager.findById(cid);
        console.log("carrito", cart);
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        res.render("cartView", {
            cart: cart, 
            user: res.locals.user, 
            onlyAdmin: res.locals.isAdmin, 
            isPremium: res.locals.isPremium});
    }catch (error) {
        console.error("Error en viewOneCart:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}
const viewRegister = (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        res.status(500).send({ error });
    }
}
const viewLogin = (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        res.status(500).send({ error });
    }
}
const viewProfile = (req, res) => {
    const isAdmin = res.locals.user && res.locals.user.role === 'admin';
    try {
        res.render('profile', {
            user: res.locals.user,
            onlyAdmin: isAdmin
        })
    } catch (error) {
        res.status(500).send({ error });
    }
}
const mockingProducts = (req, res) => {
    const products = [];
    for (let i = 1; i <= 100; i++) {
        const product = generateProduct();
        products.push(product);
    }
    // res.json(products);
    try {
        res.render("home", { products: products });
    } catch (error) {
        res.status(500).json({ error });
    }
}
const recoverPass = (req, res) => {
    try {
        res.render("recoverPass")
    } catch (error) {
        res.status(500).json({ error });
    }
}
const restorepassword = (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Token inválido o faltante');
    }
    try {
        const decoded = jwt.verify(token, config.jwt_secret_key, );
        if (decoded) {
            // Verifica que el token no haya caducado
            if (decoded.exp * 1000 > Date.now()) {
                res.render("restorePassword",{token});
            }
        }
    } catch (error) {
        if(error.message == "jwt expired"){
        res.render("expiredToken")
        }
    }
}
const newPassword = async(req, res) => {
    const {token} = req.body
    try {
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        if (newPassword !== confirmPassword) {
            return res.status(400).send('Las contraseñas no coinciden');
        }
        const newPass = await userService.newPassword(newPassword, token)
        return res.render("login")
    } catch (error) {
        if(error.message === "PASSWORDS_MUST_NOT_MATCH"){
            return res.send("No puedes ingresar una contraseña anterior")
        }
        res.status(500).json({ error });
    }
}
const newProduct = async(req,res)=>{
    try {
        res.render("roleProducts",{
            user: res.locals.user, 
            onlyAdmin: res.locals.isAdmin, 
            isPremium: res.locals.isPremium})
    } catch (error) {
        res.status(500).json({ error });
    }
}
const myproducts = async (req, res) => {
    const sessionUserEmail = req.session.user.email;
    try {
        const products = await productService.findMyProducts(sessionUserEmail);
        res.render("myProducts", {
            products, 
            user: res.locals.user, 
            onlyAdmin: res.locals.isAdmin, 
            isPremium: res.locals.isPremium });
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error });
    }
};

export default {
    allProducts,
    realtimeproducts,
    oneProduct,
    viewAllProducts,
    viewOneCart,
    viewRegister,
    viewLogin,
    viewProfile,
    mockingProducts,
    restorepassword,
    recoverPass,
    newPassword,
    newProduct,
    myproducts
}