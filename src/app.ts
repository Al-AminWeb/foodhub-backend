import express from "express";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello, This is the Express app! of FoodHub");
});

export default app;
