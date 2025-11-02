// backend/src/middleware/corsConfig.js
import cors from "cors";

const corsConfig = cors({
  origin: [
    "https://stu-teacher-kmq2.vercel.app", // your frontend
    "http://localhost:5173", // dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

export default corsConfig;
