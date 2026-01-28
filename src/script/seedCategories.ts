import { prisma } from "../lib/prisma";

async function seedCategories() {
    try {
        const categories = ["Salads", "Main Course", "Desserts", "Drinks"];

        for (const name of categories) {
            await prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }

        console.log("Categories seeded successfully");
    } catch (error) {
        console.error("Error seeding categories:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedCategories();