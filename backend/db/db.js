import mongoose from "mongoose"

const connectDb = async ()=>{
    try {
       const connection = await mongoose.connect(process.env.MONGODB_URI)
       console.log("MongoDb connected successfully")
        
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

export default connectDb;