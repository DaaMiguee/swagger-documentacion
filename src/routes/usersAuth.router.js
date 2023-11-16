import { Router } from "express";
import passport from "passport";
import usersController from "../controllers/users.controller.js";

const router = Router();


router.get('/githubSignup',passport.authenticate('github', { scope: [ 'user:email' ] }))

router.get('/github',passport.authenticate('github',{ 
    failureRedirect: '/login',
    successRedirect: "/view/products"
    }),
)

router.post('/premiun/:uid', usersController.changeRole)


export default router;