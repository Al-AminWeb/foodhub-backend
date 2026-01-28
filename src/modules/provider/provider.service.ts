import {prisma} from "../../lib/prisma";


const addMeal = async (userId: string, payload:any) => {
    try {

        const provider = await prisma.providerProfile.findUnique({
            where: { userId },
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
    }
    catch (error: any) {
        console.error("Prisma error while adding meal:", error); // log full error
        throw error; // rethrow original error instead of masking it
    }

}


const updateMeal = async (userId: string, mealId: string, payload: any) => {
    try {
        // Step 1: Find provider
        const provider = await prisma.providerProfile.findUnique({
            where: { userId },
        });

        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw new Error("Provider profile not found");
        }

        // Step 2: Find meal
        const meal = await prisma.meal.findUnique({
            where: { id: mealId }
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
            where: { id: mealId },
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
    try{
        const provider = await prisma.providerProfile.findUnique({
            where: { userId },
        })
        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw new Error("Provider profile not found");
        }
        const meal = await prisma.meal.findUnique({
            where: { id: mealId }
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
            where: { id: mealId }
        })
        console.log("✅ Meal deleted successfully:", mealId);
        return { deleted: true, mealId };
    }
    catch (error:any){
        console.error("❌ Error in deleteMeal service:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}

export const providerService = {
    addMeal,
    updateMeal,
    deleteMeal,
}