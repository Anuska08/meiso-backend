const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost:27017/meiso"; // Replace with your database URI

// Optional: Set Mongoose settings like this to suppress warnings
mongoose.set("strictQuery", false);

async function connectDB() {
    try {
      await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }
  
  connectDB();
  

const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
fullName: {
type: String,
required: true
},
mobileNumber: {
type: String,
required: true
},
emergencyContactNumber: {
type: String,
required: true
},
emailAddress: {
type: String,
required: true,
unique: true
},
password: {
type: String,
required: true
}
});

userSchema.plugin(AutoIncrement, {inc_field: 'uid'});


const journalSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
journalData: {
type: String,
required: true
},
datetime: {
type: Date,
default: Date.now
}
});



const moodTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sleep: {
    type: String,
    enum: ['No Sleep','Poor', 'Average', 'Good', 'Excellent'],
    required: true
  },
  meditation: {
    type: Boolean,
    default: false
  },
  medication: {
    type: Boolean,
    default: false
  },
  socialized: {
    type: String,
    enum: ['None','Minimal', 'Average', 'Good', 'Excellent'],
    default: 'None'
  },
  mood: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const testSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
testId: {
type: String,
required: true
},
testResult: {
type: String,
enum: ['In Crisis', 'Struggling', 'Surviving', 'Thriving', 'Excelling'],
required: true
},
datetime: {
type: Date,
default: Date.now
}
});

const User = mongoose.model('User', userSchema);
const Journal = mongoose.model('Journal', journalSchema);
const MoodTracker = mongoose.model('MoodTracker', moodTrackerSchema);
const Test = mongoose.model('Test', testSchema);

  