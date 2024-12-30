const express = require('express');
let ejs = require('ejs');
const app = express();
const port = 3004;

app.set('view engine', 'ejs')
// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

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

app.get('/students/edit/:sid', async (req, res) => {
    const sid = req.params.sid;

    const student = await pool.query("select * from student where sid = ?", [sid])

    if(!student){
        console.log("No student found")
    }
    else{
        res.render('updateStudent', {student: student[0], errors: []})
    }
})

app.post('/students/edit/:sid', async (req, res) =>{
    const sid = req.params.sid;
    const {name, age} = req.body;
    const errors = [];

    if(!name || name.length < 2){
        errors.push('Student Name should be more than 2 characters');
    }

    if(!age || age < 18){
        errors.push('Student Age must be atleast 18');
    }

    if (errors.length > 0) {
        //render the form again with error messages and the previously entered data
        return res.render('updateStudent', { 
          student: { sid, name, age }, 
          errors 
        });
    }

    await pool.query(
        'update student set name = ?, age = ? where sid = ?',[name, age, sid]
    );

    res.redirect('/students');

})

app.get('/students/add', (req, res) => {
    res.render('addStudent', {errors: [], student: {}});
})

app.post('/students/add', async (req, res) => {
    const {sid, name, age} = req.body;
    const errors = [];

    if(!sid || sid.length !== 4){
        errors.push('Student ID must be exactly 4 characters');
    }

    if(!name || name.length < 2){
        errors.push('Student Name should be more than 2 characters');
    }

    if(!age || age < 18){
        errors.push('Student Age must be atleast 18');
    }

    const existingStudent = await pool.query('SELECT * FROM student WHERE sid = ?', [sid]);

    if (existingStudent.length > 0) {
      errors.push(`Student with ID ${sid} already exists.`);
    }

    if (errors.length > 0) {
        //render the form again with error messages and the previously entered data
        return res.render('addStudent', { 
          student: { sid, name, age }, 
          errors 
        });
    }

    await pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age]);

    res.redirect('/students');
})

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
