const Appointment = require('../models/Appointment');
const User = require('../models/user');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { appointmentTime, therapist } = req.body;

    // Validate input
    if (!appointmentTime) {
      return res.status(400).json({ message: 'Please provide appointment time' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      uid: req.user.id,
      appointmentTime: new Date(appointmentTime),
      therapist: therapist || "Ms. Gathoni"
    });

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // Update all appointment statuses first
    await Appointment.updateAllStatuses();
    
    // Get appointments for the logged-in user
    const appointments = await Appointment.find({ uid: req.user.id })
      .sort({ appointmentTime: 1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // Check if appointment belongs to user
    if (appointment.uid.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access this appointment' 
      });
    }
    
    // Update status if needed
    await appointment.updateStatus();
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // Check if appointment belongs to user
    if (appointment.uid.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this appointment' 
      });
    }
    
    // Update appointment
    const { appointmentTime, therapist, status } = req.body;
    
    if (appointmentTime) appointment.appointmentTime = new Date(appointmentTime);
    if (therapist) appointment.therapist = therapist;
    if (status && ['Attended', 'Unattended'].includes(status)) {
      appointment.status = status;
    }
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }
    
    // Check if appointment belongs to user
    if (appointment.uid.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this appointment' 
      });
    }
    
    await appointment.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
};
