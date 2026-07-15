import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import errorMiddleware from "./middlewares/error.middleware";
import requestLogger from "./middlewares/requestLogger.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import env from "./config/env";

const app = express();

if (env.NODE_ENV !== "test") {
  app.use(requestLogger);
}

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(errorMiddleware);

export default app;
