import { prisma } from "../../lib/prisma";

interface MealFilter {
    search?: string;
    categoryId?: string;
    providerId?: string;
    minPrice?: number;
    maxPrice?: number;
}

const getAllMeals = async (filters: MealFilter) => {
    try {
        const {
            search,
            categoryId,
            providerId,
            minPrice,
            maxPrice,
        } = filters;

        const meals = await prisma.meal.findMany({
            where: {
                AND: [
                    search
                        ? {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }
                        : {},
                    categoryId ? { categoryId } : {},
                    providerId ? { providerId } : {},
                    minPrice !== undefined ? { price: { gte: minPrice } } : {},
                    maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
                ],
            },
            include: {
                category: true,
                provider: {
                    select: {
                        restaurant: true,
                    },
                },
            },
            orderBy: {
                id: "desc", // ✅ FIXED (createdAt removed)
            },
        });

        return meals;
    } catch (error) {
        console.error("❌ Service Error (getAllMeals):", error);
        throw new Error("Failed to fetch meals");
    }
};


const getMealById = async (id: string) => {
    return prisma.meal.findUnique({
        where: { id },
        include: {
            provider: true,
            category: true,
            reviews: {
                include: {
                    user: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};
export const mealService = {
    getAllMeals,
    getMealById,
};
