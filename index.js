const express = require("express");
const cors = require("cors")
const app = express();
const mainRouter = require("../backend/routes/index");
app.use("/api/v1", mainRouter);
app.use(cors())
app.use(express.json());
app.listen(3000);


