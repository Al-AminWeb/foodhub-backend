import {AuthRequest} from "../../middleware/auth.middleware";
import {Response} from "express";
import {categoryService} from "./cacategory.service";
import {prisma} from "../../lib/prisma";

const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const category = await categoryService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });

    } catch (error: any) {
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

const updateCategory = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;


        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const category = await categoryService.updateCategory(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error: any) {
        console.error("❌ Controller Error (updateCategory):", error);

        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message.includes("already exists")) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to update category",
            error: process.env.NODE_ENV === "development" ? {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            } : undefined,
        });
    }
};

const deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;


        await categoryService.deleteCategory(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        console.error("❌ Controller Error (deleteCategory):", error);

        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message.includes("Cannot delete")) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to delete category",
            error: process.env.NODE_ENV === "development" ? {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            } : undefined,
        });
    }
};


export const categoryController = {
    createCategory,
    updateCategory,
    deleteCategory
}