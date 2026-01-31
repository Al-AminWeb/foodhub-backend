import express from 'express';
import {authMiddleware} from "../../middleware/auth.middleware";
import {categoryController} from "./category.controller";
import {requireRole} from "../../middleware/role.middleware";
import {Role} from "../../../generated/prisma/enums";


const router = express.Router();

router.get('/all-category',authMiddleware, categoryController.getAllCategories);
router.post('/category', authMiddleware, requireRole([Role.ADMIN]), categoryController.createCategory);
router.put("/category/:id", authMiddleware, requireRole([Role.ADMIN]), categoryController.updateCategory);
router.delete("/category/:id", authMiddleware, requireRole([Role.ADMIN]), categoryController.deleteCategory);


export const categoryRouter = router;