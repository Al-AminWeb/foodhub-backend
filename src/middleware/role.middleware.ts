
import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { Role } from "../../generated/prisma/enums";

export const requireRole = (roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(", ")}`
            });
        }
        next();
    };
};

// Usage in routes:
// router.get('/users', authMiddleware, requireRole([Role.ADMIN]), adminUserController.getAllUsers);