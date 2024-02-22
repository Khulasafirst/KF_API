const mongoose = require("mongoose");
const CitySchema = new mongoose.Schema({
name: {
    type: String,
   default:"",
  },
  countryid: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Countrys",
        },
  stateid: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
    },
  
},{timestamps:true});

const City = mongoose.model('Citys',CitySchema);
module.exports = City;