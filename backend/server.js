import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import eventRoutes from "./routes/eventRoutes.js";


dotenv.config();  
connectDB();  

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://eventify-bgzhjl7fo-krishna-dave206s-projects.vercel.app",
  "https://eventify-ipwrjfoz6-krishna-dave206s-projects.vercel.app",
  "https://eventify.vercel.app" // in case you set a custom domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
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
