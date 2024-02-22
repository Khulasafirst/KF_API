const mongoose = require("mongoose");
const CountrySchema = new mongoose.Schema({
name: {
    type: String,
   default:"",
  }

  
},{timestamps:true});

const Country = mongoose.model('Countrys',CountrySchema);
module.exports = Country;