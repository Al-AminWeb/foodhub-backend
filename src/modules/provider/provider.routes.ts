import express from "express";
import {providerController} from "./provider.controller";

const router = express.Router();

router.post("/meals", providerController.addMeal);

export const providerRoutes = router;