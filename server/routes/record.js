const express = require("express");

// recordRoutes is an instance of the express router
// we use it to define our routes
// router is added as a middleware and will take control of requests starting with path /record
const recordRoutes = express.Router();

// this helps us connect to the database
const dbo = require("../db/conn");

// this helps convert the is from string to ObjectID for the _id
const ObjectId = require("mongodb").ObjectId;

// this helps you get a list of all the records
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result)
        })
})

// this helps you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("records")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        })
})

// this helps you create a new record
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        person_name: req.body.person_name,
        person_position: req.body.person_position,
        person_level: req.body.person_level,
    };
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    })
})

// this helps you update a record by id
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId(req.params.id)};
    let newvalues = {
        $set: {
            person_name: req.body.person_name,
            person_position: req.body.person_position,
            person_level: req.body.person_level,
        },
    };
    db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated")
            response.json(res)
        })
})

// this lets you delete a record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId(req.params.id)}
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted")
        response.status(obj)
    })
})

module.exports = recordRoutes;