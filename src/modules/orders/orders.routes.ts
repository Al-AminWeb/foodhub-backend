import express from "express";
import {authMiddleware} from "../../middleware/auth.middleware";
import {orderController} from "./orders.controller";
import {requireRole} from "../../middleware/role.middleware";
import {Role} from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/me", authMiddleware, orderController.getMyOrders);
router.get("/all", authMiddleware, requireRole([Role.ADMIN]), orderController.getAllOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);

export const orderRouter = router;
