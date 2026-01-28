
import {Request, Response} from 'express';
import {providerService} from "./provider.service";

const addMeal = async (req: Request, res: Response) => {
    try {
        const userId  = req.user.id;
        const meal = await providerService.addMeal(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Meal added successfully",
            data: meal,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const providerController = {
    addMeal,
};