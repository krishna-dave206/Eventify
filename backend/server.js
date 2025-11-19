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
  origin: [
    "http://localhost:5173",          // local dev
    "https://eventify-frontend.vercel.app" // your vercel frontend (we’ll update name soon)
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
