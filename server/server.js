const path = require("path");
const express = require("express");
const cors = require("cors")
const app = express();
require ("dotenv").config({path: "./config.env"})
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.use(require("./routes/record"))
const publicPath = path.join(__dirname, "..", "build");
const dbo = require("./db/conn")

app.use(express.static(publicPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
})

app.listen(port, () => {
    dbo.connectToServer(function (err) {
        if (err) console.log(err);
    });
    console.log(`Server is up on port ${port}`);
})

