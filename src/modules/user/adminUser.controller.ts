import {Role} from "../../../generated/prisma/enums";
import {adminUserService} from "./adminUser.service";
import {Request, Response} from "express";


const getAllUsers = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;

        const role = req.query.role as Role | undefined;

        const isActive =
            req.query.isActive === 'true' ? true
                : req.query.isActive === 'false' ? false
                    : undefined;

        const page = Number(req.query.page as string) || 1;
        const limit = Number(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy as string | undefined;

        const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';


        const result = await adminUserService.getAllUsers({
            search,
            role,
            isActive,
            page,
            limit,
            sortBy,
            sortOrder,
            skip
        });

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            ...result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
}


const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {isActive} = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be boolean",
            });
        }



        const updateUser = await adminUserService.updateUserStatus(id, isActive);
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: updateUser,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Failed to update user status",
        })
    }
}

export const adminUserController = {
    getAllUsers,
    updateUserStatus,
};