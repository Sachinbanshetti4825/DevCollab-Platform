import {body} from "express-validator";

export const registerValidator=[

    body("username")
    .isString()
    .withMessage("username should be string")
    .notEmpty()
    .withMessage("Username is required"),
    body("email")
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:4,max:20})   
    .withMessage("Password must be between 4 and 20 characters")

]

export const loginValidator=[
    body("email")
    .isEmail()
    .withMessage("Email must be valid Email")
    .notEmpty()
    .withMessage("Email is required"),
    body("password")
    .isLength({min:4,max:20})
    .withMessage("Password must be between 4 and 20 characters")
    .notEmpty()
    .withMessage("Password is required")
    
]