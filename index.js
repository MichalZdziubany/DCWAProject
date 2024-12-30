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

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/proj2024MongoDB', {

})
.then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });;

const lecturerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    did: String
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

//define routes for ejs files
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/students', async (req, res) => {
    const students = await pool.query("select * from student order by sid")

    res.render('students', { students });
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
