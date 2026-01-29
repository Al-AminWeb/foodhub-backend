import {prisma} from "../../lib/prisma";
import {OrderStatus} from "../../../generated/prisma/enums";


const addMeal = async (userId: string, payload: any) => {
    try {

        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
        });
        if (!provider) {
            throw new Error("Provider profile not found");
        }
        return await prisma.meal.create({
            data: {
                name: payload.name,
                price: payload.price,
                description: payload.description,
                image: payload.image,
                categoryId: payload.categoryId,
                providerId: provider.id,
            }
        })
    } catch (error: any) {
        console.error("Prisma error while adding meal:", error); // log full error
        throw error; // rethrow original error instead of masking it
    }

}


const updateMeal = async (userId: string, mealId: string, payload: any) => {
    try {
        // Step 1: Find provider
        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
        });

        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw new Error("Provider profile not found");
        }

        // Step 2: Find meal
        const meal = await prisma.meal.findUnique({
            where: {id: mealId}
        });

        if (!meal) {
            console.error("❌ Meal not found with id:", mealId);
            throw new Error("Meal not found");
        }

        // Step 3: Check authorization
        if (meal.providerId !== provider.id) {
            console.error("❌ Unauthorized: Meal belongs to different provider");
            console.error("Meal providerId:", meal.providerId, "User providerId:", provider.id);
            throw new Error("You are not authorized to update this meal");
        }

        // Step 4: Update meal
        const updatedMeal = await prisma.meal.update({
            where: {id: mealId},
            data: payload,
        });

        console.log("✅ Meal updated successfully:", updatedMeal.id);
        return updatedMeal;
    } catch (error: any) {
        console.error("❌ Error in updateMeal service:", error.message);
        console.error("Full error:", error);
        throw error;
    }
};


const deleteMeal = async (userId: string, mealId: string) => {
    try {
        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
        })
        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw new Error("Provider profile not found");
        }
        const meal = await prisma.meal.findUnique({
            where: {id: mealId}
        })
        if (!meal) {
            console.error("❌ Meal not found with id:", mealId);
            throw new Error("Meal not found");
        }
        if (meal.providerId !== provider.id) {
            console.error("❌ Unauthorized: Meal belongs to different provider");
            throw new Error("You are not authorized to delete this meal");
        }
        await prisma.meal.delete({
            where: {id: mealId}
        })
        console.log("✅ Meal deleted successfully:", mealId);
        return {deleted: true, mealId};
    } catch (error: any) {
        console.error("❌ Error in deleteMeal service:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}


const updateOrderStatus = async (userId: string, orderId: string, status: OrderStatus) => {
    try {
        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
        });
        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw Error("Provider profile not found");
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                items: {
                    some: {
                        meal: {providerId: provider.id},
                    },
                },
            },
            include: {
                items: {
                    include: {
                        meal: true,
                    },
                },
            },
        });

        if (!order) {
            console.error("❌ Order not found or unauthorized for orderId:", orderId);
            throw new Error("Order not found or you are not authorized to update this order");
        }

        // Step 3: Update order status
        const updatedOrder = await prisma.order.update({
            where: {id: orderId},
            data: {status},
        });

        console.log("✅ Order status updated successfully:", orderId, "New status:", status);
        return updatedOrder;
    } catch (error: any) {
        console.error("❌ Error in updateOrderStatus service:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}
export const providerService = {
    addMeal,
    updateMeal,
    deleteMeal,
    updateOrderStatus
}