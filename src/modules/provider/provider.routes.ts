import express from "express";
import {providerController} from "./provider.controller";
import {authMiddleware} from "../../middleware/auth.middleware";
import {requireRole} from "../../middleware/role.middleware";
import {Role} from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/meals", authMiddleware, requireRole([Role.PROVIDER]), providerController.addMeal);
router.put("/meals/:id", authMiddleware, requireRole([Role.PROVIDER]), providerController.updateMeal);
router.delete("/meals/:id", authMiddleware, requireRole([Role.PROVIDER]), providerController.deleteMeal);
router.patch("/orders/:id", authMiddleware, requireRole([Role.PROVIDER]), providerController.updateOrderStatus);
router.get("/orders", authMiddleware, requireRole([Role.PROVIDER]), providerController.getProviderOrders);

export const providerRouter = router;