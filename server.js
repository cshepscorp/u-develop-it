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
// db.query('SELECT * FROM candidates', (err, rows) => {
//     console.log(rows);
// });

// GET a single candidate
// db.query('SELECT * FROM candidates WHERE id = 1', (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// DELETE a  candidate
/* The DELETE statement has a question mark (?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder.*/
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     /* An additional param argument following the prepared statement provides values to use in place of the prepared statement's placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. 
//     So this would be the same as saying 'DELETE FROM candidates WHERE id = 1' */ 
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// CREATE a candidate
/* We made a few changes to this statement to account for the length of this SQL query. The SQL command and the SQL parameters were assigned to the sql and params variables respectively to improve the legibility for the call function to the database.*/
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//     VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Default response for any other request (Not Found)
// This catchall route will override all others—so make sure that this is the last one.
app.use((req, res) => {
    res.status(404).end();
  });

// start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });