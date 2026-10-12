import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db";
import authRoutes from "./routes/auth";
import clientRoutes from "./routes/clients";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/", taskRoutes);

app.use(errorHandler);

export default app;
