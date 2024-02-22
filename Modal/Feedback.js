const mongoose = require("mongoose");
const FeedbackSchema = new mongoose.Schema({
  
  name:{
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  message: {
    type: String,
  },
  readstatus: {
    type: Boolean,
    default: false,
  },

},{timestamps:true});

const Feedback = mongoose.model('Feedbacks',FeedbackSchema);
module.exports = Feedback;
