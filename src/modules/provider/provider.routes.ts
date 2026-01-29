import express from "express";
import {providerController} from "./provider.controller";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/meals", authMiddleware, providerController.addMeal);
router.put("/meals/:id", authMiddleware, providerController.updateMeal);
router.delete("/meals/:id", authMiddleware, providerController.deleteMeal);
router.patch("/orders/:id", authMiddleware, providerController.updateOrderStatus);


export const providerRouter = router;