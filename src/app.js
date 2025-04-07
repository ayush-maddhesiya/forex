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
// import transactionRoute from "./routes/transaction.route.js";
// import paymentRoute from "./routes/payment.route.js";


//app.use("/api/v1", router)
app.use("/api/v1/user", userRoute)
// app.use("/api/v1/transaction", transactionRoute)
// app.use("/api/v1/payment", paymentRoute)

export default app;