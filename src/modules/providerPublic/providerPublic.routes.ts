import express from "express";
import {providerPublicController} from "./providerPublic.controller";


const router = express.Router();

router.get("/", providerPublicController.getAllProviders);
router.get("/:id", providerPublicController.getProviderWithMenu);

export const providerPublicRouter = router;
