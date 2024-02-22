const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    permission: [
      {
        type: String,
        default: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ],
      },
    ],

    profileimage: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1683114108~exp=1683114708~hmac=737eb37de1d9a84ce67cddfdb6864c3db78c9bc09e6cf4ff34956719ea2caabe",
    },
    phone: {
      type: String,
      default: "",
    },
    alternetephone: {
      type: String,
      default: "",
    },
    country: {
      
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countrys",
      
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
    
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citys",
    
    },
    default_news_state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
    
    },
    default_news_country: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "Countrys",
    },
    default_news_city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citys",    
    },
    isphoneverified: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      default: "SubAdmin",
      enum: [
        "SuperAdmin",
        "SubAdmin",
        "Accountant",
        "Editor",
        "Editor",
        "Reporter",
      ],
    },

    otp: {
      type: String,
      default: "",
    },
    resettoken: {
      type: String,
      default: "",
    },
    dateofjoining: {
      type: String,
      default: "",
    },
    newsapproved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
      },
    ],
    commentapproved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    newsposted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    appointeddate: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admins", AdminSchema);
module.exports = Admin;
