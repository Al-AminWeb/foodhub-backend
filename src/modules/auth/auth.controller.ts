import {Request, Response} from 'express';
import {authService} from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const result = await authService.login(email, password);

        console.log(result)

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};

const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.Register(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const me = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;

        const user = await authService.me(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


export const authController = {
    login,
    register,
    me
}