var express = require('express');
const mysql = require('mysql2');
var router = express.Router();
require('dotenv').config({ path: './TEST.env' })

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // Generate a random (x, y) point between (0, 0) and (100, 100)
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;

  // Find the closest point in the database
  db.query(
    `SELECT x, y, SQRT(POW(x - ?, 2) + POW(y - ?, 2)) AS distance
    FROM random_points
    ORDER BY distance
    LIMIT 1`,
    [randomX, randomY],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length === 0) {
        res.render('index', { title: 'CSC 519 - DMMEHTA2 - No distance'});
      }

      const closestPoint = results[0];
      const distance = closestPoint.distance;

      res.render('index', { title: 'CSC 519 - DMMEHTA2', x1: randomX, y1: randomY, x2: closestPoint.x, y2: closestPoint.y, distance: distance });
    }
  );

  
  });
module.exports = router;
