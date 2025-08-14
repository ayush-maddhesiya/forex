import Express  from "express";
const app = Express();
import cookieParser from "cookie-parser";
import cors from 'cors'
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";



app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(helmet());

app.use(morgan("dev"));


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per IP per 15 mins
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
});
app.use("/api/", apiLimiter);  // Apply limiter only to API routes



app.use(Express.json({ limit: "16kb"}))
app.use(Express.urlencoded({extended: true, limit : "16kb"}))
app.use(Express.static("public"))
app.use(cookieParser())





app.get("/", (req, res) => {
    res.send("Welcome to the API");
});



import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
//commented out routes for now, will be added later




// import transactionRoute from "./routes/transaction.route.js";
// import paymentRoute from "./routes/payment.route.js";


app.get("/api/v1", (req, res) => {
    res.send("Welcome to the API for Forex Trading");
});


app.use("/api/v1/user", userRoute)
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/dashboard", dashboardRoute);
//commented out routes for now, will be added later

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});


// app.use("/api/v1/transaction", transactionRoute)
// app.use("/api/v1/payment", paymentRoute)

export default app;