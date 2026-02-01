import {prisma} from "../../lib/prisma";
import {OrderStatus} from "../../../generated/prisma/enums";


const validTransitions = {
    [OrderStatus.PLACED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
};


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
                price: Number(payload.price),
                description: payload.description,
                image: payload.image,
                categoryId: payload.categoryId,
                providerId: provider.id,
            }
        })
    } catch (error) {
        throw new Error("Failed to add meal");
    }
}


const updateMeal = async (userId: string, mealId: string, payload: any) => {
    try {

        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
        });

        if (!provider) {
            console.error("❌ Provider not found for userId:", userId);
            throw new Error("Provider profile not found");
        }


        const meal = await prisma.meal.findUnique({
            where: {id: mealId}
        });

        if (!meal) {
            console.error("❌ Meal not found with id:", mealId);
            throw new Error("Meal not found");
        }


        if (meal.providerId !== provider.id) {
            console.error("❌ Unauthorized: Meal belongs to different provider");
            console.error("Meal providerId:", meal.providerId, "User providerId:", provider.id);
            throw new Error("You are not authorized to update this meal");
        }


        const updatedMeal = await prisma.meal.update({
            where: {id: mealId},
            data: payload,
        });

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

        // Step 1: Fetch the order first
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

        // Step 2: Validate status transition (MOVED AFTER fetching order)
        if (!validTransitions[order.status].includes(status)) {
            throw new Error(`Invalid status transition from ${order.status} to ${status}`);
        }

        // Step 3: Update order status
        const updatedOrder = await prisma.order.update({
            where: {id: orderId},
            data: {status},
        });

        return updatedOrder;
    } catch (error: any) {
        console.error("❌ Error in updateOrderStatus service:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}


const getProviderOrders = async (userId: string) => {
    try {
        const provider = await prisma.providerProfile.findUnique({
            where: { userId },
        });

        if (!provider) {
            throw new Error("Provider profile not found");
        }

        // Fetch orders that contain at least one item from this provider
        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        meal: {
                            providerId: provider.id
                        }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        meal: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                providerId: true, // Added providerId to filter
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // 🔥 FILTER: Only return items that belong to this provider
        const filteredOrders = orders.map(order => ({
            ...order,
            items: order.items.filter(item => item.meal.providerId === provider.id)
        }));

        return filteredOrders;
    } catch (error: any) {
        console.error("❌ Error in getProviderOrders service:", error.message);
        throw error;
    }
};

const getMyMeals = async (userId: string) => {
    try {
        const provider = await prisma.providerProfile.findUnique({
            where: {userId},
            include: {
                meals: {
                    include: {
                        category: true, // Include category info
                    },
                    orderBy: {
                        name: "asc",
                    }
                },
            },
        });

        if (!provider) {
            throw new Error("Provider profile not found");
        }

        return provider.meals;
    } catch (error: any) {
        console.error("❌ Error in getMyMeals service:", error.message);
        throw error;
    }
};

export const providerService = {
    addMeal,
    updateMeal,
    deleteMeal,
    updateOrderStatus,
    getProviderOrders,
    getMyMeals,
}