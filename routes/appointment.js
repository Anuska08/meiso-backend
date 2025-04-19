const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointment');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Routes for all appointments
router.route('/')
  .post(createAppointment)
  .get(getAppointments);

// Routes for specific appointment
router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
