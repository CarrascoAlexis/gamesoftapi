const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.body.filter == undefined || req.body.filter == null)
    {
        db.query('SELECT * FROM session', (err, results) => {
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
        db.query(generateQuery("session", results, req.body.filter), (err, results) => {
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

    let { ip, account_id } = req.body;
    if(ip == undefined || ip == null)
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
        db.query('INSERT into session VALUES (NULL, ?, ?, ?, CURDATE())', [ip, token, account_id], (err, results) => {
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