import {Role} from "../../../generated/prisma/enums";
import {adminUserService} from "./adminUser.service";


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
export const adminUserController = {
    getAllUsers,
};