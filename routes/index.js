import express from "express";
import bikeInfo from "./modules/bikeInfo.js";

const router = express.Router();

router.use("/bikeInfo", bikeInfo);
export default router;