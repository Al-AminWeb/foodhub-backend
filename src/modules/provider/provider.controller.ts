import {Request, Response} from "express";
import {providerService} from "./provider.service";
import {AuthRequest} from "../../middleware/auth.middleware";
import {OrderStatus} from "../../../generated/prisma/enums";

const addMeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const meal = await providerService.addMeal(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Meal added successfully",
            data: meal,
        });
    } catch (error: any) {


        res.status(400).json({
            success: false,
            message: error?.message || "Failed to add meal",
            error: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};

const updateMeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;


        const meal = await providerService.updateMeal(userId, id, req.body);
        res.status(201).json({
            success: true,
            message: "Meal updated successfully",
            data: meal,
        })
    } catch (error: any) {
        {
            console.error("❌ Controller Error (updateMeal):", error);

            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                    error: process.env.NODE_ENV === "development" ? {
                        name: error?.name,
                        message: error?.message,
                    } : undefined,
                });
            }

            if (error.message.includes("not authorized")) {
                return res.status(403).json({
                    success: false,
                    message: error.message,
                    error: process.env.NODE_ENV === "development" ? {
                        name: error?.name,
                        message: error?.message,
                    } : undefined,
                });
            }

            return res.status(400).json({
                success: false,
                message: error?.message || "Failed to update meal",
                error: process.env.NODE_ENV === "development" ? {
                    name: error?.name,
                    message: error?.message,
                    stack: error?.stack,
                } : undefined,
            });
        }
    }
}

const deleteMeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;


        await providerService.deleteMeal(userId, id);

        res.status(200).json({
            success: true,
            message: "Meal deleted successfully",
        });
    } catch (error: any) {
        console.error("❌ Controller Error (deleteMeal):", error);

        // Check specific error types
        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === "development" ? {
                    name: error?.name,
                    message: error?.message,
                } : undefined,
            });
        }

        if (error.message.includes("not authorized")) {
            return res.status(403).json({
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === "development" ? {
                    name: error?.name,
                    message: error?.message,
                } : undefined,
            });
        }

        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to delete meal",
            error: process.env.NODE_ENV === "development" ? {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            } : undefined,
        });

    }

}


const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;
        const {status} = req.body;


        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }
        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid order status. Valid statuses are: ${Object.values(OrderStatus).join(", ")}`,
            });
        }

        const order = await providerService.updateOrderStatus(
            userId,
            id,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });

    } catch (error: any) {
        console.error("❌ Controller Error (updateOrderStatus):", error);

        // Check specific error types
        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === "development" ? {
                    name: error?.name,
                    message: error?.message,
                } : undefined,
            });
        }

        if (error.message.includes("not authorized")) {
            return res.status(403).json({
                success: false,
                message: error.message,
                error: process.env.NODE_ENV === "development" ? {
                    name: error?.name,
                    message: error?.message,
                } : undefined,
            });
        }
        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to update order status",
            error: process.env.NODE_ENV === "development" ? {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            } : undefined,
        });
    }
}

const getProviderOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const orders = await providerService.getProviderOrders(userId);

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        console.error("❌ Controller Error (getProviderOrders):", error);

        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to fetch orders",
        });
    }
};


export const providerController = {
    addMeal,
    updateMeal,
    deleteMeal,
    updateOrderStatus,
    getProviderOrders,
};