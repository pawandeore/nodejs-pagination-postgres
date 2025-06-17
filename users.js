const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /users?page=1&limit=10
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const total = await pool.query('SELECT COUNT(*) FROM users');
    const result = await pool.query(
      'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      page,
      limit,
      total: parseInt(total.rows[0].count),
      totalPages: Math.ceil(total.rows[0].count / limit),
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
