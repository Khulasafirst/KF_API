const mongoose = require("mongoose");
const TagsSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
      },
      // createdby: 
      //   {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "admin",
      //   },
      
},{timestamps:true});

const Tags = mongoose.model('Tags',TagsSchema);
module.exports = Tags;