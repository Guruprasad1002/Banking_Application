import mongoose from "mongoose";
import 'dotenv/config';
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("Database Connected to Server Successfully");        
    }
    catch(error){
        console.log(error);        
    }
}
export default connectDB;
