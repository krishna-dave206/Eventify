import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import eventRoutes from "./routes/eventRoutes.js";


dotenv.config();  
connectDB();  // Connect to MongoDB

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});


app.listen(5000, () => console.log("Server running at 5000"));
