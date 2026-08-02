import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import checkoutRoutes from "./routes/checkoutRoutes";
import webhookRoutes from "./routes/webhookRoutes";

dotenv.config();

const app = express();

app.use(morgan("dev"));

//////////////// CORS ////////////////

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  // Agrega acá las preview URLs de Vercel que uses para testing con tu equipo,
  // ej. "https://tu-proyecto-git-branch-usuario.vercel.app"
].filter(Boolean);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

//////////////////////////////////////

// IMPORTANTE: el webhook de Stripe va ANTES de express.json() porque necesita
// el body crudo (raw) para verificar la firma. No mover de lugar.
app.use("/api/webhooks/stripe", webhookRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Success",
    message: "Server running and this is the main route",
  });
});

app.use("/api/checkout", checkoutRoutes);

export default app;