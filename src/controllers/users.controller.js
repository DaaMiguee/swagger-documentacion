import { userService } from '../services/users.service.js';

const getAll = async (req, res) => {
    try {
        const users = await userService.findAll();
        return res.status(200).json({ message: 'Users found', users });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.findOne(id);
        return res.status(200).json({ message: 'User', user });
    } catch (error) {
        return res.status(500).json({ error });
    }
}
const getByEmail = async (req, res) => {
    const { email } = req.body
    try {
        const user = await userService.findByEmail(email)
        if (!user) {
            return res.send("No existe un usuario con ese correo")
        } else {
            return res.send("Se enviaron las instrucciones para recuperar su contraseña a su correo electrónico")
        }
        // return res.status(200).json({message: "user", user})
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const create = async (req, res) => {
    const userData = req.body;
    console.log('DATAAAAA',userData);
    try {
        const newUser = await userService.createOne(userData);
        return res.status(200).json({ message: 'New User added', newUser });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    try {
        const response = await userService.updateOne(id, userData);
        return res.status(200).json({ message: 'User updated successfully', response });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await userService.deleteOne(id);
        return res.status(200).json({ message: 'User deleted successfully', response });
    } catch (error) {
        return res.status(500).json({ error });
    }
}
const changeRole = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.findOne(uid)
        if(!user){
            return res.status(401).json({message:"Usuario no encontrado"})
        }
        const oldRole = user.role
        let newRole;
        if (oldRole === "user") {
            newRole = "premium";
        } else {
            newRole = "user";
        }
        const response = await userService.changeRole(newRole, uid)
        return res.status(200).json({message: "User whith new role", response})
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    getByEmail,
    changeRole,
}