import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function createServer(){

    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Express server connected  mongodb Database")
    }
    catch(error){
        console.log("Database connection failed : ",error.message)
    }

}

export default createServer;