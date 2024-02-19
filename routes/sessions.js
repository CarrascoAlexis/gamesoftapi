const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.query.filter == undefined || req.query.filter == null)
    {
        db.query('SELECT account_id, creation_date, ephemeral FROM session', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
        return;
    }
    db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'session';", (err, results) => {
        if(err)
        {
            res.json({"error": err})
            return;
        }
        db.query(generateQuery("session", results, req.query.filter, "account_id, creation_date"), (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
        })
    })
});

router.post("/create", (req, res) => {
    let { ip, account_id, ephemeral } = req.body.params;
    if(ephemeral == "1") ephemeral = 1
    else ephemeral == 0
    if(ip == undefined || ip == null || ip == 'undefined')
    {
        res.json({"error": `No IP Defined`})
        return;
    }
    db.query('SELECT id FROM account WHERE id = ?', [account_id], (err, results) => {
        if(err) {
            res.json({"error": err})
            throw err;
        }
        if (results.length == 0)
        {
            res.json({"error": `Account with id ${account_id} undefined`})
            return;
        }
        const token = require('crypto').randomBytes(94).toString('hex').substring(0, 48);
        db.query('INSERT into session VALUES (NULL, ?, ?, ?, CURDATE(), ?)', [ip, token, account_id, ephemeral], (err, results) => {
                if(err) {
                    res.json({"error": err})
                    throw err;
                }
                res.json({"token": token, "results": results})
            })
    })
})

router.post("/delete", (req, res) => {
    let { token } = req.body;
    db.query('DELETE FROM session WHERE token = ?', [token], (err, results) => {
        if(err) {
            res.json({"error": err})
            throw err;
        }
        res.json(results)
    })
})

module.exports = router;