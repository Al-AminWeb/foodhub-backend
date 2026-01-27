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

    } catch (error) {
        console.log(error)
    }
}

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


export const authService = {
    Register,
    login
}