import express from "express";
import {authMiddleware} from "../../middleware/auth.middleware";
import {orderController} from "./orders.controller";

const router = express.Router();

router.post("/", authMiddleware, orderController.createOrder);
router.get("/me", authMiddleware, orderController.getMyOrders);
router.get("/all", authMiddleware, orderController.getAllOrders);

export const orderRouter = router;
