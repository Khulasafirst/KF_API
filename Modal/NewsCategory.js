const mongoose = require("mongoose");
const NewsCategorySchema = new mongoose.Schema({
    name: {
        type: String,
       default:"",
      },
      name2: {
        type: String,
       default:"",
      },
      slug: {
        type: String,
       default:"",
      },
      categoryorder: {
        type: Number,
       default:100,
      },
      imageurl: {
        type: String,
       default:"",
      },
      // createdby: 
      //   {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "Admins",
      //   },
},{timestamps:true});

const NewsCategory = mongoose.model('NewsCategorys',NewsCategorySchema);
module.exports = NewsCategory;