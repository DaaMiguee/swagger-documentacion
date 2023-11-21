import { Router } from "express";
import viewController from '../controllers/views.controller.js'
import { getUserData, checkSession, checkAdmin, publicAcces, privateAcces, manageProducts, checkAdminSession, checkRole, checkAndCreateCart} from '../middlewares/middlewares.js'

const router = Router();

router.get('/', checkAdmin, getUserData, checkRole, viewController.allProducts);
router.get('/realtimeproducts',checkAdminSession, manageProducts, getUserData, checkRole, viewController.realtimeproducts);
router.get('/product/:pid', viewController.oneProduct);
router.get('/view/products', getUserData, checkAndCreateCart, viewController.viewAllProducts),
router.get('/view/carts/:cid', getUserData, checkAndCreateCart, checkRole, viewController.viewOneCart);
router.get('/register', publicAcces, viewController.viewRegister);
router.get('/login', publicAcces, viewController.viewLogin);
router.get('/profile', privateAcces, getUserData, viewController.viewProfile);
router.get('/mockingproducts', viewController.mockingProducts);
router.get('/recoverpass', viewController.recoverPass)
router.get('/restorepassword', viewController.restorepassword);
router.post('/newpassword', viewController.newPassword)
router.get('/newproduct', getUserData, checkRole, manageProducts, viewController.newProduct)
router.get('/myproducts', getUserData, checkRole, manageProducts, viewController.myproducts)

export default router
