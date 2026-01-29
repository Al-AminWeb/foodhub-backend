import express from 'express';
import {authMiddleware} from "../../middleware/auth.middleware";
import {categoryController} from "./category.controller";


const router = express.Router();


router.post('/category', authMiddleware, categoryController.createCategory);
router.put("/category/:id", authMiddleware, categoryController.updateCategory);
router.delete("/category/:id", authMiddleware, categoryController.deleteCategory);
export const categoryRouter = router;