import { cartsManager } from '../DAL/DAOs/MongoDAOs/carts.manager.dao.js';
import { cartModel } from '../DAL/mongoDB/models/carts.model.js';
import { ticketModel } from '../DAL/mongoDB/models/ticket.js';
import { productsModel } from '../DAL/mongoDB/models/products.model.js';
import loguer from '../winston.js';
import { productService } from '../services/products.service.js';
// Obtiene todos los carritos
const getAll = async(req,res) =>{
    try {
        const carts = await cartsManager.findAll();
        if(!carts.length){
            return res.status(400).send({message: "Carts not found"})
        }
        return res.status(200).json({ message: "Carts", carts})
    } catch (error) {
        res.status(500).json({error})
    }
}

// Obtiene un carrito por su ID
const getById = async(req,res) =>{
    const {cid} = req.params;
    try {
        const cart = await cartsManager.findById(cid);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        return res.status(200).json({ message: "Cart", cart });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
}

// Crea un nuevo carrito
const create = async(req,res) =>{
    try {
        const newCart = await cartsManager.createOne(req.body)
        return res.status(200).send({ message: "New cart created", newCart });
    } catch (error) {
        res.status(500).json({error})
    }
}

// Actualiza un carrito por su ID
const updateById = async(req,res) =>{
    const cid = req.params.cid;
    const {products} = req.body;
    try {
        const updatedCart = await cartsManager.updateCartProducts(cid, products);
        return res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Elimina un carrito por su ID
const deleteById = async(req,res) =>{
    const {cid} = req.params;
    try {
        const response = await cartsManager.deleteOne(cid)
        if(!response){
            return  res.status(404).send({message: "Cart not found"});
        }
        return res.status(200).json({ message: "Cart deleted successfully", response})
    } catch (error) {
        res.status(500).json({error})
    }
}

// Agrega un producto a un carrito
const addProdToCart = async(req,res) =>{
    const {cid, pid} = req.params;
    if(!cid || !pid){
        return res.status(400).send("Missing parameters");
    }
    try {
        const emailUser = res.locals.user.email;
        const product = await productService.findById(pid)
        if(product.owner === emailUser){
            return res.status(403).send("You can't buy your own product")
        }
        const response = await cartsManager.addProduct(cid, pid);
        return res.status(200).json({message: "Product added successfully", response})
    } catch (error) {
        return error
    }
}

// Actualiza un producto dentro de un carrito
const updProdToCart = async(req,res) =>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    try {
        const updatedCart = await cartsManager.updateQuantity(cid, pid, quantity);
        return res.status(200).json({ message: "Product quantity updated successfully", cart: updatedCart });
    } catch (error) {
        return  res.status(500),send({error})
    }
}

// Elimina un producto de un carrito
const delProdToCart = async(req,res) =>{
    const {cid, pid} = req.params;
    try {
        const response = await cartsManager.delProduct(cid, pid)
        return res.status(200).send({ message: "Product deleted successfully"})
    } catch (error) {
        return  res.status(500),send({error})
    }
}
const purchase = async (req, res) => {
    const { cid } = req.params;
    console.log("prueba");
    console.log("session", req.session);
    console.log("localss", res.locals.user);
    try {
        const cart = await cartModel.findById(cid);
        console.log("CAAARRT", cart);
        // Verifica que el carrito exista
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Crea un objeto de compra para el ticket
        const purchaseData = {
            purchaser: res.locals.user.email,
            purchase_datetime: new Date(),
            // code: "2234234233", // generar codigo aca y no en el model
            amount: 0, // Inicialmente, el monto es 0
        };
        // Array para mantener un registro de los productos que no pudieron comprarse
        const productsNotPurchased = [];
        // Recorre los productos en el carrito
        for (const product of cart.products) {
            const productDetails = await productsModel.findById(product.product._id);
            // Verifica si el producto tiene suficiente stock para la cantidad deseada
            if (productDetails && productDetails.stock >= product.quantity) {
                // Resta la cantidad del producto del stock
                productDetails.stock -= product.quantity;
                await productDetails.save();
                // Añade el costo del producto al monto total de la compra
                purchaseData.amount += productDetails.price * product.quantity;
            } else {
                // Agrega el producto a la lista de los que no pudieron comprarse
                productsNotPurchased.push(product.product);
            }
        }
        // Guarda los productos que no se pudieron comprar en el carrito
        cart.products = productsNotPurchased;
        await cart.save();
        // Crea el ticket de compra
        const ticket = new ticketModel(purchaseData); // Asigna purchaseData directamente
        await ticket.save();
        return res.status(200).json({
            message: "Purchase details",
            notPurchasedProducts: productsNotPurchased,
            ticket,
        });
    } catch (error) {
        loguer.error("An error occurred:", error);
        return res.status(500).json({ message: "An error occurred while processing the purchase" });
    }
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    addProdToCart,
    updProdToCart,
    delProdToCart,
    purchase,
}