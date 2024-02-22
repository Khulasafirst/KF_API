const mongoose = require("mongoose");
const SocialmedialinksSchema = new mongoose.Schema({
    title: {
        type: String,
       defalut:"",
      },
      icon: {
        type: String,
       default:"",
      },
      link: {
        type: String,
       default:"",
      },     
},{timestamps:true});

const Socialmedialinks = mongoose.model('Socialmedialinks',SocialmedialinksSchema);
module.exports = Socialmedialinks;