import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";


const defaultPort = 3000;
dotenv.config();

const app = express();
const port = process.env.PORT || defaultPort;

app.use(cors());
app.use(router);

app.get("/", (req, res) => {
    res.send("Opendata Demo Backend Side!");
});

app.listen(port, () => {
    console.log (`Opendata Demo listening on port ${port}`);
})