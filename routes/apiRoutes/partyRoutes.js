const express = require('express'); // import express
const router = express.Router(); // import router so we can route from anywhere
const db = require('../../db/connection');

// GET all parties
// The voting app that we're building toward eventually will have an interface to display all parties and display an individual party. Naturally, we'll need to provide API endpoints for each of these features.
router.get('/parties', (req, res) => {
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
router.get('/party/:id', (req, res) => {
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
router.delete('/party/:id', (req, res) => {
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

module.exports = router;