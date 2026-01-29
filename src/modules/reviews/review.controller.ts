import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { reviewService } from "./review.service";

const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const review = await reviewService.createReview(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: review,
        });
    } catch (error: any) {
        console.error("❌ createReview controller:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getReviewsByMeal = async (req: Request, res: Response) => {
    try {
        const { mealId } = req.params;
        const reviews = await reviewService.getReviewsByMeal(mealId);

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        console.error("❌ getReviewsByMeal controller:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const reviewController = {
    createReview,
    getReviewsByMeal,
};
