const express = require('express'); // import express
const { resourceLimits } = require('worker_threads');
const router = express.Router(); // import router so we can route from anywhere
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck'); // import inputCheck module
const { put } = require('./candidateRoutes');


router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`; // add DESC in order to make it sort backwards z-a

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully pulled voters',
            data: rows
        });
    });
});

// get single voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'succesfully got voter',
            data: row
        });
    });
});

// Assuming the front end will send us the user's first name, last name, and email address
router.post('/voter', ({ body }, res) => {
    // prevent empty data
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
      }
    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
        res.json({
            message: 'success',
            data: body
        });
    });

});

// CHANGE voter information - email address
router.put('/voter/:id', (req, res) => {
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.json(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'successfully updated voter record',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// DELETE a voter
router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    // we did not create a params array to store the req.params.id. Although creating semantic variable names will increase your code's legibility, there is a cost due to allocating memory to store the object. Without the params array, the code is just as legible without the extra expenditure.
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'Voter successfully deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;