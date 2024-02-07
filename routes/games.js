const express = require('express');
const mysql = require('mysql2');

const router = express.Router()

const config = require('../config')
const db = mysql.createConnection(config.db)

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
        let query = "SELECT * FROM game WHERE "
        results.forEach((element, idx, array) => {
            if(req.body.filter[element.COLUMN_NAME] != undefined && req.body.filter[element.COLUMN_NAME] != null)
            {
                query += `${element.COLUMN_NAME} = "${req.body.filter[element.COLUMN_NAME]}"`
            }
            else
            {
                query += `${element.COLUMN_NAME} IS NOT NULL`
            }
            if (idx != array.length - 1){
                query += ' AND '
            }
        })
        db.query(query, (err, results) => {
            if(err) res.json({"error": err})
            res.json(results)
            
        })
    })
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM game WHERE id = ?', [id], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})

router.post("/create", (req, res) => {
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