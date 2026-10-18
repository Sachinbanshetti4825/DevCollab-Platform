import mongoose from "mongoose";

let organizationMembershipSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organizations",
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["owner","admin","member"],
        default:"Member"
    }
})

organizationMembershipSchema.index(
    { user: 1, organization: 1 },
    { unique: true }
);

let OrganizationMemberShip=mongoose.model("organizationMembers",organizationMembershipSchema);

export default OrganizationMemberShip;