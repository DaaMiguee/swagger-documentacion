import { cartsManager } from "../DAL/DAOs/MongoDAOs/carts.manager.dao.js";

class CartService{
    async findAll(){

    }
    async findOne(){

    }
    async createOne(uid){
        // console.log("ID DEL USER", uid);
        try {
            const response = await cartsManager.createCartUser(uid)
            return response
        } catch (error) {
            throw error;
        }
    }
    async updateOne(){

    }
    async deleteOne(){
        
    }
}

export const cartService = new CartService();