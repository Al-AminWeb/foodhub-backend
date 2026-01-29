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

        return category;
    } catch (error: any) {
        console.error("❌ Error in createCategory service:", error.message);
        throw error;
    }
}
const updateCategory = async (categoryId: string, payload: any) => {
    try {
        const category = await prisma.category.findUnique({
            where: {id: categoryId},
        });
        if (!category) {
            throw new Error("Category not found");
        }
        if (payload.name && payload.name !== category.name) {
            const existingCategory = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: payload.name,
                        mode: 'insensitive',
                    },
                    id: {
                        not: categoryId,
                    },
                },
            });
            if (existingCategory) {
                throw new Error("Category with this name already exists");
            }
        }
        const updatedCategory = await prisma.category.update({
            where: {id: categoryId},
            data: {
                name: payload.name,
            },
        });


        return updatedCategory;

    } catch (error: any) {
        console.error("❌ Error in updateCategory service:", error.message);
        throw error;
    }
}


const deleteCategory = async (categoryId: string) => {
    try {

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: { meals: true },
                },
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }


        if (category._count.meals > 0) {
            throw new Error(
                `Cannot delete category. It has ${category._count.meals} meal(s) associated with it. Please reassign or delete those meals first.`
            );
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });


        return { deleted: true, categoryId };
    } catch (error: any) {
        console.error("❌ Error in deleteCategory service:", error.message);
        throw error;
    }
};

export const categoryService = {
    createCategory,
    updateCategory,
    deleteCategory,
}