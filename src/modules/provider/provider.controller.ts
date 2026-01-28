import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const addMeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        console.log("req.user:", req.user);
        const meal = await providerService.addMeal(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Meal added successfully",
            data: meal,
        });
    } catch (error: any) {
        // Log full error details to console
        console.error("Error adding meal:", error);

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
        console.log("📝 Updating meal:", id, "for user:", userId);
        console.log("📦 Update payload:", req.body);

        const meal = await providerService.updateMeal(userId, id, req.body);
        res.status(201).json({
            success: true,
            message: "Meal updated successfully",
            data: meal,
        })
    }
    catch (error:any) {
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





export const providerController = {
    addMeal,
    updateMeal
};