import "dotenv/config"; 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./db/db.js";
import userRoutes from "./src/routes/user.routes.js";
import folderRoutes from "./src/routes/folder.routes.js";
import noteRoutes from "./src/routes/note.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";

const app = express();



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is ready",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});