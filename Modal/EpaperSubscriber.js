const mongoose = require("mongoose");
const EpaperSubscriberSchema = new mongoose.Schema({
    
      userid: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        planid: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subscriptionplans",
        },
        to_date: {
            type:Date,
           default:Date.now,
          },
          end_date: {
            type:Date,
           default:Date.now,
          },
          status:{
            type:Boolean,
            default:false,
          }
},{timestamps:true});

const EpaperSubscriber = mongoose.model('EpaperSubscribers',EpaperSubscriberSchema);
module.exports = EpaperSubscriber;