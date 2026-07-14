import mongoose, { Schema } from "mongoose";

const subCategory= new Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }
},
{timestamps:true}
)

const SubCategory=mongoose.model("SubCategory",subCategory)

export default SubCategory