import passport from "passport";
import config from "../config/config.js";
import { userModel } from "../DAL/mongoDB/models/users.model.js";
import { cartModel } from "../DAL/mongoDB/models/carts.model.js";
import { Strategy as GitHubStrategy } from "passport-github2";


passport.use("github", new GitHubStrategy({
    clientID: config.github_client_id,
    clientSecret: config.github_client_secret,
    callbackURL: config.github_callback_url
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const userDB = await userModel.findOne({email:profile._json.email});
        if(!userDB){
            const newUser ={
                first_name: profile.displayName.split(" ")[0],
                last_name: profile.displayName.split(" ")[1],
                email: profile._json.email,
                password: "",
            }
            const result = await userModel.create(newUser);
            // Crear un nuevo carrito vacío y asociarlo al usuario
            // const newCart = new cartModel({
            //     user: result._id, // Asocia el carrito al usuario recién registrado
            //     products: [], // Inicialmente, el carrito está vacío
            // });
            // await newCart.save();
            done(null, result)
        }else{
            done(null, userDB)
        }
    } catch (error) {
        return done(error);
    }
}
));


passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user);
    } catch (error) {
        done(error)
    }
})
