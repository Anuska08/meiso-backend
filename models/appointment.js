const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapist: {
    type: String,
    default: "Ms. Gathoni",
    required: true
  },
  appointmentTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Attended', 'Unattended'],
    default: 'Unattended'
  }
}, { timestamps: true });

// Pre-save middleware to check if appointment time has passed
AppointmentSchema.pre('save', function(next) {
  const currentTime = new Date();
  if (this.appointmentTime < currentTime && this.status === 'Unattended') {
    this.status = 'Attended';
  }
  next();
});

// Method to update status based on current time
AppointmentSchema.methods.updateStatus = function() {
  const currentTime = new Date();
  if (this.appointmentTime < currentTime && this.status === 'Unattended') {
    this.status = 'Attended';
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to update all appointments' statuses
AppointmentSchema.statics.updateAllStatuses = function() {
  const currentTime = new Date();
  return this.updateMany(
    { 
      appointmentTime: { $lt: currentTime },
      status: 'Unattended'
    },
    { 
      $set: { status: 'Attended' } 
    }
  );
};

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
