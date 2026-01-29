import { Request, Response } from "express";
import {providerPublicService} from "./providerPublic.service";


const getAllProviders = async (_req: Request, res: Response) => {
    try {
        const providers = await providerPublicService.getAllProviders();

        res.status(200).json({
            success: true,
            data: providers,
        });
    } catch (error: any) {
        console.error("❌ getAllProviders controller error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

const getProviderWithMenu = async (req: Request, res: Response) => {
    try {
        const provider = await providerPublicService.getProviderWithMenu(
            req.params.id
        );

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        res.status(200).json({
            success: true,
            data: provider,
        });
    } catch (error: any) {
        console.error("❌ getProviderWithMenu controller error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const providerPublicController = {
    getAllProviders,
    getProviderWithMenu,
};
