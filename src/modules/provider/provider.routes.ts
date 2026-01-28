import express from "express";
import {providerController} from "./provider.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/meals", authMiddleware,providerController.addMeal);
router.put("/meals/:id", authMiddleware,providerController.updateMeal);



export const providerRouter = router;