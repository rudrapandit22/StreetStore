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

// Allow any localhost port Vite might pick (5173, 5174, 5175...)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://streetstore.onrender.com",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
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
