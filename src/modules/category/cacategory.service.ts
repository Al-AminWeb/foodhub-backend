import {prisma} from "../../lib/prisma";

const createCategory = async (payload: any) => {
    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: payload.name,
                    mode: "insensitive"
                }
            }
        });

        if (existingCategory) {
            throw new Error("Category already exists");
        }
        const category = await prisma.category.create({
            data: {
                name: payload.name,
            }
        });
        console.log("✅ Category created:", category.name);
        return category;
    } catch (error: any) {
        console.error("❌ Error in createCategory service:", error.message);
        throw error;
    }
}


export const categoryService = {
    createCategory
}