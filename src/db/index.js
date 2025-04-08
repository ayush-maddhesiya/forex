import mongoose from "mongoose";
  

const connectDB = async ()=>{
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`Mongo Connected !!!!`);
    } catch (error) {
        console.log("Mongo not connect !!",error);
        process.exit(1)
    }
    
}


export default connectDB;