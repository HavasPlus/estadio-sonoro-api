import { Router } from "express";
import RecordController from "../controllers/RecordController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Rota postar áudio
router.post("/", [checkJwt], RecordController.postRecord);


// router.post("/change-password", [checkJwt], RecordController.changePassword);

export default router;
