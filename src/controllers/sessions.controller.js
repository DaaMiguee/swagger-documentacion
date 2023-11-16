import { userManager } from "../DAL/DAOs/MongoDAOs/users.manager.dao.js";
import { hashData } from "../utils.js";
import {cartModel} from '../DAL/mongoDB/models/carts.model.js'
import config from "../config/config.js";
import { transporter } from "../nodemailer.js";
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send("Please enter all fields");
    }
    try {
        if (email === config.admin_email && password === config.admin_password) {
            req.session.user = {
                name: "Coder Admin",
                email: config.admin_email,
                role: "admin",
            }
            // console.log('Sesion de administrador creada:', req.session.user);
            return res.send({ status: "success", message: "Logeo exitoso" });
        } else {
            // Autenticación de usuarios normales utilizando userManager
            const authResult = await userManager.authenticateUser(email, password);
            if (authResult.success) {
                const { user } = authResult;

                // Busca el carrito del usuario en la base de datos
                const userCart = await cartModel.findOne({ user: user._id });
                // Crea un objeto de sesión con los datos del usuario y el ID del carrito
                const sessionUser = {
                    id: user._id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: user.role,
                    cart: userCart ? userCart._id : null,
                };
                // console.log('Sesion de usuario creada:', sessionUser);
                req.session.user = sessionUser;
                return res.status(200).json({ status: 'success', message: 'Successful login' });
            } else {
                return res.status(400).json({ status: 'error', error: "Incorrect credentials" });
            }
        }
    } catch (error) {
        // console.log('Error en el inicio de sesión:', error);
        res.status(500).json({ error });
    }
}

const register = async(req,res) =>{
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }
    try {
        const exist = await userManager.findUserByEmail(email);
        if (exist) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }
        const hashPassword = await hashData(password);
        const newUser = await userManager.createOne({ ...req.body, password: hashPassword });
        // console.log('Usuario creado:', newUser);

        const htmlContent = `
        <h1>Bienvenido ${first_name} ${last_name}</h1>
        <p>Usted ha sido satisfactoriamente registrado(a) en nuestra tienda en línea</p>`
        const message ={
            from: "Ecomerce",
            to: newUser.email,
            subject: "Registro exitoso",
            html: htmlContent
        };
        await transporter.sendMail(message)

        // Crear un nuevo carrito vacío y asociarlo al usuario
        const newCart = new cartModel({
            user: newUser._id, // Asocia el carrito al usuario recién registrado
            products: [], // Inicialmente, el carrito está vacío
        });
        // console.log(newCart)
        await newCart.save();
        // console.log('Carrito creado:', newCart);
        
        return res.status(200).send({
            status: "succes",
            message: "User registered",
            user: newUser
        })
    } catch (error) {
        // console.log('Error en el registro:', error);
        res.status(500).json({ error })
    }
}

const logout = async(req,res) =>{
    req.session.destroy(err => {
        if (err) return res.status(500).send({
            status: "error", error: "Error al  cerrar sesion"
        })
        res.redirect('/login');
    })
}

export default{
    login,register,logout
}