const mysql = require('mysql2'); // import mysql2

const db = mysql.createConnection( // connect the application to the MySQL database
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


  module.exports = db; // so we can use elsewhere