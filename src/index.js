import dotenv from "dotenv"
import app from './app.js'

import connectDB from "./db/index.js";
dotenv.config({
    path: './.env'
})

console.log("Port : ", process.env.PORT)

connectDB()
.then(()=>{
    app.listen(process.env.PORT ,()=>{
        console.log(`Server is listening on port : ${process.env.PORT}`);

    })
})
.catch((error)=>{
    console.error("Mongoose connection failed",error)
})