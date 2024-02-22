const mongoose = require("mongoose");
const WebsiteContentSchema = new mongoose.Schema({
  title:{
    type:String,
    default:""
  },
  description:{
    type:String,
    default:""
  },
  imageurl:{
    type:String,
    default:""
  },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
      },
},{timestamps:true});

const WebsiteContents = mongoose.model('WebsiteContents',WebsiteContentSchema);
module.exports = WebsiteContents;