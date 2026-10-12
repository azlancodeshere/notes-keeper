
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
import userRoutes from "./src/routes/user.routes.js";



dotenv.config()

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json())
app.use(cookieParser())


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is ready"
    })
})

app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 3000



connectDb()


app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})