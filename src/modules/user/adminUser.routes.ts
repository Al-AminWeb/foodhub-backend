import express from 'express';
import {adminUserController} from "./adminUser.controller";
import {authMiddleware} from "../../middleware/auth.middleware";
import {requireRole} from "../../middleware/role.middleware";
import {Role} from "../../../generated/prisma/enums";



const router = express.Router();

router.get('/users', authMiddleware, requireRole([Role.ADMIN]), adminUserController.getAllUsers);
router.patch('/users/:id', authMiddleware, requireRole([Role.ADMIN]), adminUserController.updateUserStatus);
export const adminUserRouter = router;