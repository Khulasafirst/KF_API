const mongoose = require("mongoose");
const StateSchema = new mongoose.Schema({
    name: {
        type: String,
       
      },
      countryid: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Countrys",
        },
        // createdby: 
        // {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "admin",
        // },
      
},{timestamps:true});

const State = mongoose.model('States',StateSchema);
module.exports = State;