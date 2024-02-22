const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    profileimage: {
      type: String,
      default: "",
    },
    defaultcity: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citys",
    }],
    defaultstate: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
    }],
    notification: [
      {
        notificationid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notifications",
        },
        readstatus: {
          type: Boolean,
          default: false,
        },
      },
    ],
    device_id: {
      type: String,
      default: "",
    },
    device_type: {
      type: String,
      default: "",
    },
    device_notification_token_id: {
      type: String,
      default: "",
    },
    device_app_version: {
      type: String,
      default: "",
    },
    resettoken: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: "",
    },
    isphoneverified: {
      type: Boolean,
      default: "false",
    },
    isblocked: {
      type: String,
      default: "",
    },

    comments: [
      {
        commentid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comments",
        },
      },
    ],
    lastlogin: [
      {
        date: {
          type: String,
        },
      },
    ],
    lastpasswordchange: [
      {
        date: {
          type: String,
        },
      },
    ],
    //categoryId  ayagi
    newsintrest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newsintrest",
      },
    ],
    freetrial_used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);
module.exports = User;
