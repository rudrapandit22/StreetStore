import express, { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middle";
const router = express.Router();


router.post("/",authenticateSeller)

export default router;