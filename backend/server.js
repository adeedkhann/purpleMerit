import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./database/connectDb.js"



connectDb();

const app =express();
app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`)
})



