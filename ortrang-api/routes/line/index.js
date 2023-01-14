const express = require("express");
const router = express.Router();
const orController = require("../../controllers/line/orController");

/* GET users listing. */
/* http://localhost:3000/linebot/ */

router.post("/", orController.index);

module.exports = router;
