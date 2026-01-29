import express from "express";
import {authRouter} from "./modules/auth/auth.routes";
import {adminUserRouter} from "./modules/user/adminUser.routes";
import {providerRouter} from "./modules/provider/provider.routes";
import {categoryRouter} from "./modules/category/category.routes";
import {mealRouter} from "./modules/meal/meal.routes";
import {providerPublicRouter} from "./modules/providerPublic/providerPublic.routes";
import {orderRouter} from "./modules/orders/orders.routes";
import {reviewRouter} from "./modules/reviews/review.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminUserRouter);
app.use("/api/provider", providerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api", mealRouter);
app.use("/api/providers", providerPublicRouter);
app.use("/api/orders", orderRouter)
app.use("/api/reviews",reviewRouter)

app.get("/", (req, res) => {
    res.send("Hello, This is the Express app! of FoodHub");
});

export default app;
