const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.query.filter == undefined || req.query.filter == null)
    {
        db.query('SELECT * FROM type', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
        return;
    }
    db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'type';", (err, results) => {
        if(err)
        {
            res.json({"error": err})
            return;
        }
        db.query(generateQuery("type", results, req.query.filter), (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
        })
    })
});

router.post("/create", (req, res) => {
    if(!config.trustedsIp.includes(req.socket.remoteAddress)) res.json({"error": "acces denied"})
    let { name, description } = req.body;
    db.query('INSERT into type VALUES (NULL, ?, ?, ?, ?)', [name, description], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})

module.exports = router;