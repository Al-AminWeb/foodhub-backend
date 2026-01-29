import { prisma } from "../../lib/prisma";

const getAllProviders = async () => {
    try {
        return await prisma.providerProfile.findMany({
            select: {
                id: true,
                restaurant: true,
                address: true,
                phone: true,
            },
        });
    } catch (error) {
        console.error("❌ getAllProviders error:", error);
        throw new Error("Failed to fetch providers");
    }
};

const getProviderWithMenu = async (providerId: string) => {
    try {
        return await prisma.providerProfile.findUnique({
            where: { id: providerId },
            select: {
                id: true,
                restaurant: true,
                address: true,
                phone: true,
                meals: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        image: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error("❌ getProviderWithMenu error:", error);
        throw new Error("Failed to fetch provider");
    }
};

export const providerPublicService = {
    getAllProviders,
    getProviderWithMenu,
};
