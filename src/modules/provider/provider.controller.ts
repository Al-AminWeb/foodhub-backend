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

export const providerController = {
    addMeal,
};