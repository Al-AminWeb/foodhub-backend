import "dotenv/config";
import bcrypt from "bcryptjs";
import {Role} from "../../generated/prisma/enums";
import {prisma} from "../lib/prisma";




async function seedAdmin() {
    try {
        const adminEmail = "admin@foodhub.com";
        const existingAdmin = await prisma.user.findUnique({
            where: {email: adminEmail},
        });

        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 12);

        const admin = await prisma.user.create({
            data: {
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: Role.ADMIN,
                isActive: true,
            },
        });

        console.log("Admin created successfully:", admin.email);
    } catch (error) {
        console.log("Error seeding admin user:", error);
    } finally {
        await prisma.$disconnect();
    }
}


seedAdmin();