import {Role} from "../../../generated/prisma/enums";
import {prisma} from "../../lib/prisma";
import {Prisma} from "../../../generated/prisma/client";


interface GetAllUsersParams {
    search?: string;
    role?: Role;
    isActive?: boolean;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    skip: number;
}

const getAllUsers = async ({
                               search,
                               role,
                               isActive,
                               page,
                               limit,
                               sortBy,
                               sortOrder,
                               skip
                           }: GetAllUsersParams) => {

    try {
        const andConditions: Prisma.UserWhereInput[] = [];

        if (search) {
            andConditions.push({
                OR: [
                    {name: {contains: search, mode: "insensitive"}},
                    {email: {contains: search, mode: "insensitive"}},
                ],
            });
        }
        //filter by role
        if (role) {
            andConditions.push({role});
        }
        //filter by isActive
        if (typeof isActive === "boolean") {
            andConditions.push({isActive});
        }

        const user = await prisma.user.findMany({
            where: {AND: andConditions},
            skip,
            take: limit,
            orderBy: sortBy && sortOrder
                ? {[sortBy]: sortOrder}
                : {createdAt: "desc"},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });

        const total = await prisma.user.count({
            where: {AND: andConditions}
        });
        return {
            data: user,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    } catch (error) {
        throw error;
    }
}



const updateUserStatus = async (UserId: string, isActive: boolean) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: UserId},
        });
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = await prisma.user.update({
            where: {id: UserId},
            data: {isActive},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                updatedAt: true,
            },
        });
        return updatedUser;
        }
    catch(error) {
        throw error;
    }
}


export const adminUserService = {
    getAllUsers,
    updateUserStatus,
};
