import { Router } from 'express';
import ProductController from '../controllers/products.controller.js';
import { manageProducts } from '../middlewares/middlewares.js';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', manageProducts, ProductController.create);
router.put('/:id', ProductController.updateById);
router.delete('/:id', manageProducts, ProductController.deleteById);

export default router;