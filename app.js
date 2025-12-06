const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();
const port = 3000;

app.use(cors());
app.use(router);

app.get("/", (req, res) => {
    res.send("Opendata Demo Backend Side!");
});

app.listen(port, () => {
    console.log (`Opendata Demo listening on port ${port}`);
})