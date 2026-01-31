import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

type OrderItemInput = {
    mealName: string;
    qty: number;
};

const createOrder = async (
    userId: string,
    payload: {
        address: string;
        items: OrderItemInput[];
    }
) => {
    try {
        const { address, items } = payload;

        if (!address || !items || items.length === 0) {
            throw new Error("Address and items are required");
        }

        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const meal = await prisma.meal.findFirst({
                where: { name: item.mealName },
            });

            if (!meal) {
                throw new Error(`Meal not found: ${item.mealName}`);
            }

            total += meal.price * item.qty;

            orderItemsData.push({
                mealId: meal.id,
                qty: item.qty,
                price: meal.price.toString(),
            });
        }

        return await prisma.order.create({
            data: {
                userId,
                address,
                total,
                status: OrderStatus.PLACED,
                items: {
                    create: orderItemsData,
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
    } catch (error) {
        console.error("❌ createOrder error:", error);
        throw error;
    }
};

const getMyOrders = async (userId: string) => {
    try {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        meal: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("❌ getMyOrders error:", error);
        throw error;
    }
};

const getAllOrders = async () => {
    try {
        return await prisma.order.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                items: {
                    include: {
                        meal: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("❌ getAllOrders error:", error);
        throw error;
    }
};
const getOrderById = async (orderId: string, userId: string) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: {
            items: { include: { meal: true } },
            user: { select: { name: true, email: true } }
        }
    });
    if (!order) throw new Error("Order not found");
    return order;
};
export const orderService = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
};
