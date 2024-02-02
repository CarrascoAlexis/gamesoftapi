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







// API Main page (useless)
app.get('/', (req, res) => {
    res.json("coucou")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});