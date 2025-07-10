import Express  from "express";
const app = Express();
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// Security middleware - helmet for various security headers
app.use(helmet());

// Rate limiting middleware - protect against brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests from this IP, please try again later.",
        retryAfter: "15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// HTTP request logging middleware
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Data sanitization middleware - protect against NoSQL injection attacks
app.use(mongoSanitize());

// Body parsing middleware with size limits
app.use(Express.json({ limit: "16kb"}));
app.use(Express.urlencoded({extended: true, limit : "16kb"}));
app.use(Express.static("public"));
app.use(cookieParser());


import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
// import transactionRoute from "./routes/transaction.route.js";
// import paymentRoute from "./routes/payment.route.js";


//app.use("/api/v1", router)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/dashboard", dashboardRoute);
// app.use("/api/v1/transaction", transactionRoute)
// app.use("/api/v1/payment", paymentRoute)

export default app;