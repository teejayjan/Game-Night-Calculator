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

recordRoutes.route("/:email").get(function (req, res) {
    let db_connect = dbo.getDb()
    let myquery = { email: req.params.email }
    db_connect
        .collection("gnc_history")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("No results found")
            } else {
                res.json(result)
            }
        })
})

module.exports = recordRoutes