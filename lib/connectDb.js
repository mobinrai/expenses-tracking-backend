import mongoose from "mongoose";

const connectionDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("MONGO DB is connected.")
    }catch(err){
        console.log('MongoDb connection error:', err.message)
        process.exit(1)
    }
}

export default connectionDb