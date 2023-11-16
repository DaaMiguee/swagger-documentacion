import { userModel } from '../../mongoDB/models/users.model.js';
import { compareData } from '../../../utils.js'
import BasicManager from './basic.manager.dao.js';

class UserManager extends BasicManager{
    constructor(){
        super(userModel, 'cart')
    }
    async findUserByEmail(email){
        try {
            const user = await userModel.findOne({email})
            return user
        } catch (error) {
            return error
        }
    }
    async authenticateUser(email, password){
        try {
            const user = await this.findUserByEmail(email);
            if (!user) {
                return { success: false, message: 'Incorrect credentials' };
            }
            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Username or password not valid' };
            }
            return { success: true, user };
        } catch (error) {
            return { success: false, message: 'An error occurred during authentication' };
        }
    }
    async deleteUserByEmail(email){
        try {
            const deletedUser = await userModel.findOneAndDelete({email});
            if (!deletedUser) {
                return res.status(400).send({message: "User not found"});
            }
            return deletedUser;
        } catch (error) {
            return error
        }
    }
    async updatePassword (uid, newPassword){
        try {
            const user = await userModel.findById(uid);
            if(!user){
                throw Error('No such user');
            }
            user.password = newPassword;
            await user.save();
            return user
        } catch (error) {
            return error
        }
    }
    async updateRole(role, uid){
        try {
            const user = await userModel.findById(uid);
            user.role = role
            await user.save()
            return user
            
        } catch (error) {
            return error
        }
    }

}
export const userManager = new UserManager()