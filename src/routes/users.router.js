import { Router } from "express";
import UserController from '../controllers/users.controller.js'
const router = Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.put('/:id', UserController.updateById);
router.delete('/:id', UserController.deleteById);
router.post('/:email', UserController.getByEmail)


export default router