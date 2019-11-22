import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);
router.post("/loginfb", AuthController.loginFb);
router.post("/loginGoogle", AuthController.loginGoogle);
router.post("/signup", AuthController.signUp);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;