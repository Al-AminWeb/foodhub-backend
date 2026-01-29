import {Request, Response} from "express";
import {mealService} from "./meal.service";



const getAllMeals = async (req: Request, res: Response) => {
    try {
        const meals = await mealService.getAllMeals({
            search: req.query.search as string,
            categoryId: req.query.categoryId as string,
            providerId: req.query.providerId as string,
            minPrice: req.query.minPrice
                ? Number(req.query.minPrice)
                : undefined,
            maxPrice: req.query.maxPrice
                ? Number(req.query.maxPrice)
                : undefined,
        });

        res.status(200).json({
            success: true,
            data: meals,
        });
    } catch (error: any) {
        console.error("❌ Controller Error (getAllMeals):", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const getMealById = async (req: Request, res: Response) => {
    try {
        const meal = await mealService.getMealById(req.params.id);

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found",
            });
        }

        res.status(200).json({
            success: true,
            data: meal,
        });
    } catch (error: any) {
        console.error("❌ getMealById error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meal",
        });
    }
};
export const mealController = {
    getAllMeals,
    getMealById,
};