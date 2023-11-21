import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', // Referencia al modelo de Cart
        default:null
    },
    role:{
        type: String,
        enum: ['admin', 'premium', 'user'],
        default: "user"
    }
})

export const userModel = mongoose.model('User', userSchema);