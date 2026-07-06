import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartrouter from "./routes/cart.routes.js";
import cors from "cors";
import "./config/passport.js"; // registers the Google strategy

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "https://streetstore.onrender.com",
    "https://streetstorefrontend.vercel.app",
    "http://localhost:4173",
    "http://localhost:5173",
];

app.use(cors({
    origin: (origin, callback) => {
        const normalized = origin ? origin.replace(/\/$/, "") : "";
        const allowedNormalized = allowedOrigins.map(o => o.replace(/\/$/, ""));
        if (!origin || allowedNormalized.includes(normalized)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",cartrouter);


export default app;
