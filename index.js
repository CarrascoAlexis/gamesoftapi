const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5100;

const config = require('./config')

const db = mysql.createConnection(config.db)

// Connection to database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json())



app.get("/users", (req, res) => {

    if(req.body.filter == undefined)
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
        let filters = []
        results.forEach(element => {
            if(req.body.filter[element.COLUMN_NAME] != undefined)
            {
            filters[element.COLUMN_NAME] = req.body.filter[element.COLUMN_NAME]
            }
        })
        console.log(filters)
        res.json("aaaa")
        db.query('SELECT * FROM account', (err, results) => {
            if(err) res.json({"error": err})
            else res.json(results)
        })
    })
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM account WHERE id = ?', [id], (err, results) => {
        if(err) res.json({"error": err})
        else res.json(results)
    })
})



// API Main page (useless)
app.get('/', (req, res) => {
    res.send(`Succesfully connected to ${db.config.database} Database.`)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});