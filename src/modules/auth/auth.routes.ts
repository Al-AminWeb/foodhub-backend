import express from 'express';
import {authController} from "./auth.controller";
import {authMiddleware} from "./auth.middleware";

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/me', authMiddleware, authController.me);

export const authRouter = router;
