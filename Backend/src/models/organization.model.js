import mongoose from "mongoose";

const organizationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    }
},{
    timestamps:true
})

organizationSchema.index({name:1,owner:1},{unique:true});

const Organization=mongoose.model("organizations",organizationSchema);

export default Organization;
