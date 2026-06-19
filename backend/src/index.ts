import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import trackerRoutes from "./routes/tracker.routes";
import analyticsRoutes from "./routes/analytics.routes";
import certificateRoutes from "./routes/certificates.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);
app.use("/api/v1/applications", trackerRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/certificates", certificateRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "SkillBridge API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
