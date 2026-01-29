import {AuthRequest} from "../../middleware/auth.middleware";
import {Response} from "express";
import {prisma} from "../../lib/prisma";
import {categoryService} from "./cacategory.service";

const createCategory = async (req:AuthRequest, res:Response) => {
    try{
        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const category = await  categoryService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });

    }
    catch(error:any){
        console.error("❌ Controller Error (createCategory):", error);

        if (error.message.includes("already exists")) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to create category",
            error: process.env.NODE_ENV === "development" ? {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            } : undefined,
        });
    }
}

 export const categoryController = {
    createCategory
}