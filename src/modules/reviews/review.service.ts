import { prisma } from "../../lib/prisma";
import {OrderStatus} from "../../../generated/prisma/enums";




const createReview = async (
    userId: string,
    payload: {
        mealId: string;
        rating: number;
        comment: string;
    }
) => {
    try {
        const { mealId, rating, comment } = payload;

        if (!mealId || !rating || !comment) {
            throw new Error("mealId, rating and comment are required");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        // Optional: prevent duplicate review
        const existingReview = await prisma.review.findFirst({
            where: {
                userId,
                mealId,
            },
        });

        if (existingReview) {
            throw new Error("You have already reviewed this meal");
        }

        const hasOrdered = await prisma.order.findFirst({
            where: {
                userId,
                items: { some: { mealId } },
                status: OrderStatus.DELIVERED
            }
        });
        if (!hasOrdered) throw new Error("You can only review meals you have ordered and received");


        return await prisma.review.create({
            data: {
                userId,
                mealId,
                rating,
                comment,
            },
        });
    } catch (error) {
        console.error("❌ createReview error:", error);
        throw error;
    }
};

const getReviewsByMeal = async (mealId: string) => {
    try {
        return await prisma.review.findMany({
            where: { mealId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { id: "desc" },
        });
    } catch (error) {
        console.error("❌ getReviewsByMeal error:", error);
        throw error;
    }
};

export const reviewService = {
    createReview,
    getReviewsByMeal,
};
