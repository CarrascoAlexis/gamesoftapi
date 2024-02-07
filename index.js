const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5100;

const config = require('./config')

const db = mysql.createConnection(config.db)

const usersRouter = require("./routes/users")
const gamesRouter = require("./routes/games")
const motorsRouter = require("./routes/motors")
const typesRouter = require("./routes/types")

// Connection to database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json())
app.use("/users", usersRouter)
app.use("/games", gamesRouter)
app.use("/motors", motorsRouter)
app.use("/types", typesRouter)

/**
 * USER CONNECTION
 */
app.post("/connectuser", (req, res) => {
    const { id, pass } = req.body;
    console.log(id)
    console.log(pass)
    db.query('SELECT id FROM account WHERE id = ? AND password = ?', [id, pass], (err, results) => {
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