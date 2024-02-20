const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.query.filter == undefined || req.query.filter == null)
    {
        db.query('SELECT id, username, email, profile_picture, grants, first_name, last_name, public_profil, color FROM account', (err, results) => {
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
        db.query(generateQuery("account", results, req.query.filter, "id, username, email, profile_picture, grants, first_name, last_name, public_profil, color"), (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
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

router.post("/create", async (req, res) => {
    // if(!config.trustedsIp.includes(req.socket.remoteAddress)) res.json({"error": "acces denied"})
    let { username, mail, pass, profile_picture, grants, firstName, lastName, publicProfile, color } = req.body.params;
    if(publicProfile == null || publicProfile == undefined) publicProfile = 0
    if(grants == null ||grants == undefined) grants = 0;
    
    bcrypt.hash(pass, 10, function(err, hash) {
        if(err) return err;
        db.query('INSERT into account VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, mail, hash, profile_picture, grants, firstName, lastName, publicProfile, color], (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
    });
})

module.exports = router;