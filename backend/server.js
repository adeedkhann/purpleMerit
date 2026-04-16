import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./database/connectDb.js"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser";

connectDb();

const app =express();
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send('API is running...');
});



app.use("/api/v1/user" , userRouter)

app.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`)
})
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});



