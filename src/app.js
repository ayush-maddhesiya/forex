import Express  from "express";
const app = Express();
import cookieParser from "cookie-parser";
import cors from 'cors'


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(Express.json({ limit: "16kb"}))
app.use(Express.urlencoded({extended: true, limit : "16kb"}))
app.use(Express.static("public"))
app.use(cookieParser())


import userRoute from "./routes/user.route.js";



//app.use("/api/v1", router)
app.use("/api/v1", userRoute)

export default app;