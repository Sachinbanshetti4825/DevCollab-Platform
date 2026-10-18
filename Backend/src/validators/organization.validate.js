import {body} from "express-validator";

export const organizationValidator=[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isString()
    .withMessage("Organization name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Organization name must be between 2 and 50 characters")
]