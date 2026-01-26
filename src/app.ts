import express, {Application} from "express"


const app: Application = express()

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!")
})

export default app;