const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  regNo:      { type: String, default: '' },   // Roll Number
  department: { type: String, default: '' },
  batch:      { type: String, default: '' }, 
  tutorName:  { type: String, default: '' },   // e.g. "2025 - 2029"
  email:      { type: String, default: '' },
  phone:      { type: String, default: '' },
  photo:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
