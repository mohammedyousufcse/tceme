const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students?batch=2021-2025
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.batch) filter.batch = req.query.batch;
    const results = await Student.find(filter)
      .select('name regNo department batch section')
      .sort({ name: 1 })
      .limit(200);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/search?q=name&batch=2021-2025
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = {};
    if (req.query.batch) filter.batch = req.query.batch;
    if (q.trim() === '') {
      const results = await Student.find(filter)
        .select('name regNo department batch section')
        .sort({ name: 1 })
        .limit(200);
      return res.json(results);
    }
    const results = await Student.find({
      ...filter,
      $or: [
        { name:  { $regex: q, $options: 'i' } },
        { regNo: { $regex: q, $options: 'i' } }
      ]
    }).select('name regNo department batch section').limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students/bulk
router.post('/bulk', async (req, res) => {
  try {
    const docs = await Student.insertMany(req.body, { ordered: false });
    res.status(201).json({ inserted: docs.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
