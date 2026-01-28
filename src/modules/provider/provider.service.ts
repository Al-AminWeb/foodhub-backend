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
export const providerService = {
    addMeal,
}