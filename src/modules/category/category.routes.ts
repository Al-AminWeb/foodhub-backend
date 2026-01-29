import express from 'express';
import {authMiddleware} from "../../middleware/auth.middleware";
import {categoryController} from "./category.controller";


const router = express.Router();


router.post('/category', authMiddleware, categoryController.createCategory);

export const categoryRouter = router;