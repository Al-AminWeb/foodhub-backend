import express from "express";
import { authRouter } from "./modules/auth/auth.routes";
import {adminUserRouter} from "./modules/user/adminUser.routes";
import {providerRouter} from "./modules/provider/provider.routes";
import {categoryRouter} from "./modules/category/category.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminUserRouter);
app.use("/api/provider", providerRouter);
app.use("/api/admin", categoryRouter);

app.get("/", (req, res) => {
    res.send("Hello, This is the Express app! of FoodHub");
});

export default app;
