const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.body.filter == undefined || req.body.filter == null)
    {
        db.query('SELECT * FROM motor', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
        return;
    }
    db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'motor';", (err, results) => {
        if(err)
        {
            res.json({"error": err})
            return;
        }
        db.query(generateQuery("motor", results, req.body.filter), (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
        })
    })
});

router.post("/create", (req, res) => {
    if(!config.trustedsIp.includes(req.socket.remoteAddress)) {
        res.json({"error": "acces denied"})
        return;
    }

    let { name, description, link, image } = req.body;
    db.query('INSERT into motor VALUES (NULL, ?, ?, ?, ?)', [name, description, link, image], (err, results) => {
        if(err) {
            res.json({"error": err})
            throw err;
        }
        else res.json(results)
    })
})

module.exports = router;