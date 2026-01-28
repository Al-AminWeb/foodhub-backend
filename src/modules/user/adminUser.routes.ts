import express from 'express';
import {adminUserController} from "./adminUser.controller";
import {authMiddleware} from "../../middleware/auth.middleware";



const router = express.Router();

router.get('/users',authMiddleware,adminUserController.getAllUsers );

router.patch('/users/:id',authMiddleware,adminUserController.updateUserStatus );

export const adminUserRouter = router;