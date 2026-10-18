import { validationResult } from "express-validator";

let validateRequest = (req,res,next)=>{

    let errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"validation failed",
            errors:errors.array()
        })
    }

    next();

}

export default validateRequest;