const express = require('express');
const app = express();
const port = 3004;

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
