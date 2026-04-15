import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./database/connectDb.js"
import userRouter from "./routes/user.route.js"


connectDb();

const app =express();
app.use(cors());
app.use(express.json())

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



