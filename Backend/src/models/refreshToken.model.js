import mongoose from "mongoose";

const refreshSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    tokenHash:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    revokedAt:{
        type:Date,
        default:null
    }

},
{
    timestamps:true
}
)

const Refresh=mongoose.model("refreshToken",refreshSchema);

export default Refresh;