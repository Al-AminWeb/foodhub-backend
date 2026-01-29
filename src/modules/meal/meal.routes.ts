import express from 'express';
import {mealController} from "./meal.controller";

const router = express.Router();

router.get('/meals', mealController.getAllMeals);
router.get('/meals/:id', mealController.getMealById);

export const mealRouter = router;