const express = require('express');
let ejs = require('ejs');
const app = express();
const port = 3004;

app.set('view engine', 'ejs')

//promise mysql connection pool
var pmysql = require('promise-mysql')
var pool
pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then((p) => {
       pool = p
    })
    .catch((e) => {
        console.log("pool error:" + e)
    })

//define routes for ejs files
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/students', (req, res) => {
    res.render('students');
});

app.get('/grades', (req, res) => {
    res.render('grades');
});

app.get('/lecturers', (req, res) => {
    res.render('lecturers');
  });

//start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
