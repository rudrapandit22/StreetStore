import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import product
import cors from "cors";
import "./config/passport.js"; // registers the Google strategy

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app;
