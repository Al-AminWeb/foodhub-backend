import express from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

// Customer adds review
router.post("/", authMiddleware, reviewController.createReview);

// Public view reviews of a meal
router.get("/:mealId", reviewController.getReviewsByMeal);

export const reviewRouter = router;
