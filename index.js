const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5100;

const config = require('./config')

const db = mysql.createConnection(config.db)

const usersRouter = require("./routes/users")
const gamesRouter = require("./routes/games")
const motorsRouter = require("./routes/motors")
const typesRouter = require("./routes/types")
const favRouter = require("./routes/favourites")
const sessionsRouter = require("./routes/sessions")

const { cryptPassword, comparePassword } = require('./functions')

// Connection to database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next();
});

app.use(function(req, res, next) {
    if(!config.trustedsIp.includes(req.socket.remoteAddress)) {
        res.json({"error": "acces denied"})
        return;
    }
    next();
});

app.use(cors());

app.use(express.json())
app.use("/users", usersRouter)
app.use("/games", gamesRouter)
app.use("/motors", motorsRouter)
app.use("/types", typesRouter)
app.use("/favourites", favRouter)
app.use("/sessions", sessionsRouter)

/**
 * USER CONNECTION
 */
app.post("/connectuser", (req, res) => {
    if(!config.trustedsIp.includes(req.socket.remoteAddress)) res.json({"error": "acces denied"})
    res.setHeader("Access-Control-Allow-Origin", "*")
    const { id, pass } = req.body.params;
    db.query('SELECT id, password FROM account WHERE id = ?', [id], (err, results) => {
        if(err) res.json({"error": err})
        else
        {
            comparePassword(pass, results[0].password, res)
            return;
        }
    })
})

// API Main page (useless)
app.get('/', (req, res) => {
    res.send(`Succesfully connected to ${db.config.database} Database.`)
})
app.get('/ip', (req, res) => {
    res.send(`Request IP: ${req.socket.remoteAddress}`)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});