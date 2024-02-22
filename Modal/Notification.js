const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
    title:{
        type: String,
        default:"",
      },
      description:{
        type: String,
        default:"",
      },
      imagename:{
        type: String,
        default:"",
      },
      imageurl:{
        type: String,
        default:"",
      },
      
},{timestamps:true});

const Notification = mongoose.model('Notifications',NotificationSchema);
module.exports = Notification;