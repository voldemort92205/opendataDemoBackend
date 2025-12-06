const express = require("express");
const router = express.Router();
const bikeInfo = require("./modules/bikeInfo");

router.use("/bikeInfo", bikeInfo);
module.exports = router;