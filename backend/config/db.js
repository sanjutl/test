import mongoose from "mongoose";


const connectDb=async(req,res)=> {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log(`db connect successfully :${con.connection.host}`) 
    } catch (error) {
        console.log(`error:${error.message}`)
        process.exit(1)
    }
}

export default connectDb