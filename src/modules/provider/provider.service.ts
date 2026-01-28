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
    catch (error) {
        throw new Error("Failed to add meal");
    }
}
export const providerService = {
    addMeal,
}