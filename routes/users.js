const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.query.filter == undefined || req.query.filter == null)
    {
        db.query('SELECT id, username, email, profile_picture, public_profil FROM account', (err, results) => {
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
        db.query(generateQuery("account", results, req.query.filter, "id, username, email, profile_picture, public_profil"), (err, results) => {
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

router.post("/create", (req, res) => {
    // if(!config.trustedsIp.includes(req.socket.remoteAddress)) res.json({"error": "acces denied"})

    let { username, email, password, profile_picture, grants, first_name, last_name, profile_public } = req.body;
    if(profile_public == null || profile_public == undefined) profile_public = 0
    if(grants == null ||grants == undefined) grants = 0;
    db.query('INSERT into account VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)', [username, email, password, profile_picture, grants, first_name, last_name, profile_public], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})

module.exports = router;