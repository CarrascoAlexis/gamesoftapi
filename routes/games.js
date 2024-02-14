const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

const { generateQuery } = require('../functions')

router.get("/", (req, res) => {
    if(req.body.filter == undefined || req.body.filter == null)
    {
        db.query('SELECT * FROM game', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
        return;
    }
    db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'game';", (err, results) => {
        if(err)
        {
            res.json({"error": err})
            return;
        }
        db.query(generateQuery("game", results, req.body.filter), (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
        })
    })
});
router.post("/create", (req, res) => {
    if(!config.trustedsIp.includes(req.socket.remoteAddress)) res.json({"error": "acces denied"})
    
    let { title, description, priority_mass, motor_id, budget, cost, state, type_id, player_amount, productor_id } = req.body;
    if(motor_id == null || motor_id == undefined) motor_id = 0
    if(type_id == null ||type_id == undefined) type_id = 0
    if(productor_id == null || productor_id == undefined) productor_id = 0;
    console.log({ title, description, priority_mass, motor_id, budget, cost, state, type_id, player_amount, productor_id })
    console.log("COUCOU")
    db.query('INSERT into game VALUES (NULL, ?, ?, ?, ?, CURDATE(), CURDATE(), ?, ?, ?, ?, ?, ?)', [title, description, priority_mass, motor_id, budget, cost, state, type_id, player_amount, productor_id], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})

module.exports = router;