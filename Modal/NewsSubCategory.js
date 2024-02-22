const mongoose = require("mongoose");
const NewsSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  categoryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewsCategorys",
  },
  imageurl: {
    type: String,
   default:"",
  },
  categoryorder: {
    type: String,
   default:"100",
  },
  // createdby: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "admin",
  // },
},{timestamps:true});

const NewsSubCategory = mongoose.model(
  "NewsSubCategorys",
  NewsSubCategorySchema
);
module.exports = NewsSubCategory;
