import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique: true,
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
    },
    purchase_datetime:{
        type:Date,
        required:true,
        default: Date.now
    },
    amount:{
        type:Number,
        required:true
    },
    purchaser: {
        type : String,
        required:true
    }
})

export const ticketModel = mongoose.model('Ticket', ticketSchema)