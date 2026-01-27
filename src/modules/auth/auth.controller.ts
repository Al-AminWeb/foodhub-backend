import {Request, Response} from 'express';
import {authService} from "./auth.service";

const login = async (req: Request, res: Response) => {
    res.send('Login endpoint working');
}

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

export const authController ={
    login,
    register
}