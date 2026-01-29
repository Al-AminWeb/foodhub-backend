import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {orderService} from "./orders.service";


const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const order = await orderService.createOrder(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    } catch (error: any) {
        console.error("❌ createOrder controller:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getMyOrders(req.user.userId);

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllOrders = async (_req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders,
    getAllOrders,
};
