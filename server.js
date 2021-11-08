const mysql = require('mysql2'); // import mysql2
const express = require('express'); // import express
const PORT = process.env.PORT || 3001;
const app = express();

// add Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect the application to the MySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Scorpio5!!4',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );

// here, the db object is using the query() method
// the query() method runs the SQL query and executes the callback with the resulting rows matching the query
/* Onnce this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response. If there are no errors in the SQL query, the err value is null. This method is the key component that allows SQL commands to be written in a Node.js application.*/
db.query('SELECT * FROM candidates', (err, rows) => {
    console.log(rows);
});



// Default response for any other request (Not Found)
// This catchall route will override all others—so make sure that this is the last one.
app.use((req, res) => {
    res.status(404).end();
  });

// start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });