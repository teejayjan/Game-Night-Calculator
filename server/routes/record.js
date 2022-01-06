const express = require("express")

const recordRoutes = express.Router()

const dbo = require("../db/conn")

recordRoutes.route("/").post(function (req, response) {
    let db_connect = dbo.getDb()
    let myobj = {
        email: req.body.email,
        players: req.body.players,
    };
    db_connect.collection("gnc_history").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log(response.json(res).statusCode)
    })
})

module.exports = recordRoutes