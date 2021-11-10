const mysql = require('mysql2'); // import mysql2
const express = require('express'); // import express
const PORT = process.env.PORT || 3001;
const app = express();

// add Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// import inputCheck module
const inputCheck = require('./utils/inputCheck');
const { resourceLimits } = require('worker_threads');
const { result } = require('lodash');

// connect the application to the MySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );

// here, the db object is using the query() method
// the query() method runs the SQL query and executes the callback with the resulting rows matching the query
/* Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response. If there are no errors in the SQL query, the err value is null. This method is the key component that allows SQL commands to be written in a Node.js application.*/
// get ALL candidates
app.get('/api/candidates', (req, res) => { // endpoint /api/candidates. Remember, the api in the URL signifies that this is an API endpoint
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message }); // the 500 status code indicates a server error
            return; // exit the database call once an error is encountered
        }
        res.json({ // If no error, then err is null and the response is sent back using the following statement
            // instead of logging the result, rows, from the database, we'll send this response as a JSON object to the browser, using res in the Express.js route callback
            message: 'success',
            data: rows
        });
    });
});
// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`; //still able to use a WHERE clause with a JOIN, but we had to place it at the end of the statement
    const params = [req.params.id];   
    // Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message }); // 400 to notify the client that their request wasn't accepted and to try a different request
            return; // exit the database call once an error is encountered
        }
        res.json({ // If no error, then err is null and the response is sent back using the following statement
            // instead of logging the result, rows, from the database, we'll send this response as a JSON object to the browser, using res in the Express.js route callback
            message: 'success',
            data: row
        });
    });
});
// DELETE a  candidate
/* The DELETE statement has a question mark (?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder.*/
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        /* An additional param argument following the prepared statement provides values to use in place of the prepared statement's placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. 
        So this would be the same as saying 'DELETE FROM candidates WHERE id = 1' */ 
        if (err) {
            res.status(400).json({ error: err.message }); // 400 to notify the client that their request wasn't accepted and to try a different request
        } else if (!result.affectedRows) { // verify whether any rows were changed
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({ // If no error, then err is null and the response is sent back using the following statement
                // instead of logging the result, rows, from the database, we'll send this response as a JSON object to the browser, using res in the Express.js route callback
                message: 'successfully deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});
// CREATE a candidate
// use the HTTP request method post() to insert a candidate into the candidates table
// endpoint: /api/candidate
app.post('/api/candidate', ({ body }, res) => { // in callback function, use the object req.body to populate the candidate's data
    // object destructuring to pull the body property out of the request object
    // use this inputCheck module to verify that user info in the request can create a candidate
    // importing module above via require('./utils/inputCheck');
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected'); // assign errors to receive the return from the inputCheck function
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ 
            message: 'successfully added candidate',
            data: body
        });
    });

});

// update candidate table
app.put('/api/candidate/:id', (req, res) => {
    // If the front end will be making this request, though, then we should be extra sure that a party_id was provided before we attempt to update the database. Let's leverage our friend's inputCheck() function again to do so.
    const errors = inputCheck(req.body, 'party_id');
    // This now forces any PUT request to /api/candidate/:id to include a party_id property
    //  Even if the intention is to remove a party affiliation by setting it to null, the party_id property is still required
    if (errors) {
        res.status(400).json({ error: err.message });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    // This route might feel a little strange because we're using a parameter for the candidate's id (req.params.id), but the request body contains the party's id (req.body.party_id
    // Why mix the two? Again, we want to follow best practices for consistency and clarity
    // The affected row's id should always be part of the route (e.g., /api/candidate/2) while the actual fields we're updating should be part of the body.
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({ 
                message: 'successfully updated candidate',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// GET all parties
// The voting app that we're building toward eventually will have an interface to display all parties and display an individual party. Naturally, we'll need to provide API endpoints for each of these features.
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully accessed parties',
            data: rows
        });
    });
});
// GET single party
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully displayed party',
            data: row
        });
    });
});

// DELETE single party
// Building a delete route will give us an opportunity to test the ON DELETE SET NULL constraint effect through the API.
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // checks if anything was deleted
        } else if (!resourceLimits.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'successfully deleted party',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
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