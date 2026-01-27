import express, {Application} from "express"
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";


const app: Application = express()
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());


app.get("/", (req,res) => {
    res.send("Hello, This is the Express app! of FoodHub");
})

export default app;