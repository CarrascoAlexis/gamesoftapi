const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.body.filter == undefined || req.body.filter == null)
    {
        db.query('SELECT * FROM account', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
        return;
    }
    db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'account';", (err, results) => {
        if(err)
        {
            res.json({"error": err})
            return;
        }
        db.query(generateQuery("fav", results, req.body.filter), (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
        })
    })
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM account WHERE id = ?', [id], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})

module.exports = router;