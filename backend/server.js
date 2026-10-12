
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


app.get("/sum",(req,res)=>{

    const {a,b} = req.query;

    const c = Number(a) + Number(b)

    return res.send(`the sum of c is: ${c}`)
})

connectDb()


app.listen(5000)