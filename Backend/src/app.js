import express from "express"
import cookieparser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import organizationRouter from "./routes/organization.routes.js";
let app=express();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/user",userRouter);
app.use("/api/organizations",organizationRouter);

export default app;