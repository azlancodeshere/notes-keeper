
import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDb from "./db/db.js"



dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is ready"
    })
})


const PORT = process.env.PORT || 3000



connectDb()


app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})