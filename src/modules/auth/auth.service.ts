import {Role} from "../../../generated/prisma/enums";
import {prisma} from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    role?: Role,
    restaurant?: string,
    address?: string,
    phone?: string,
}

const Register = async (data: RegisterPayload) => {
    const {
        name,
        email,
        password,
        role = Role.CUSTOMER,
        restaurant,
        address,
        phone,
    } = data;

    try {
        if (!name || !email || !password) {
            throw new Error("Name, email and password are required");
        }
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            if (role === Role.PROVIDER) {
                if (!restaurant) {
                    // This error is caught by Prisma's transaction wrapper and re-thrown as a generic error
                    throw new Error("Restaurant name is required for provider");
                }

                await tx.providerProfile.create({
                    data: {
                        userId: user.id,
                        restaurant,
                        address,
                        phone,
                    },
                });
            }

            return user;
        });

        // Return success result if transaction passes
        return { success: true, user: result };

    } catch (error: any) {
        console.error("Registration Service Error:", error);

        // FIX: Handle the Prisma transaction error wrapping
        // Prisma wraps thrown errors. We need to unwrap the message or handle the generic error.
        const errorMessage = error?.message || "Registration failed";

        // If it's the specific Prisma error that wraps our manual throw,
        // sometimes we need to check the cause, but usually passing the message is enough for the controller.
        throw new Error(errorMessage);
    }
};

const login = async (email: string, password: string) => {
    try {

        if (!email || !password) {
            throw new Error("Email and password are required");
        }


        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }


        if (!user.isActive) {
            throw new Error("User account is disabled");
        }


        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            throw new Error("Invalid credentials");
        }


        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "120d",
            }
        );

        return {
            token,
        };
    } catch (error: any) {
        throw new Error(error.message || "Login failed");
    }
};

const me = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                providerProfile: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const { password, ...safeUser } = user;
        return safeUser;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch user");
    }
};


const updateProfile = async (userId: string, data: { name?: string; email?: string }) => {
    try {

        if (data.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    NOT: {
                        id: userId
                    }
                }
            });

            if (existingUser) {
                throw new Error("Email already in use");
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.email && { email: data.email }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                providerProfile: true,
            }
        });

        return updatedUser;
    } catch (error: any) {
        throw new Error(error.message || "Failed to update profile");
    }
};

export const authService = {
    Register,
    login,
    me,
    updateProfile,
}