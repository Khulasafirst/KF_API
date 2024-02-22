const express = require("express");
const {
  // registerUserCtrl,
  // loginUserCtrl,
  login_registerUserCtrl,
  updateInfo,
  getAllUserNotification,
  getAllUser,
  updateUserReadNotification,
  forgetpassworduser,
  updatepassword,
  feedbacksend,
  resendotp,
  verifyotp,
  getSingleUser,
  updateSingleUser,getAllFeedback,addComment,
  PushState,PushCity,getDefaultCity,getAllPreferanceState,getAllPreferanceCity,feedbackstatus,
} = require("../Controller/userCtrl.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

const userRoutes = express.Router();

 userRoutes.post("/login_registerUserCtrl", login_registerUserCtrl);
// userRoutes.post("/register", registerUserCtrl);
// userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/forgetpassword", forgetpassworduser);
userRoutes.post("/updatepassword", updatepassword);
userRoutes.put("/updateInfo/:id", updateInfo);
// userRoutes.get("/getAllUserNotification/:id", getAllUserNotification);
// userRoutes.patch("/updateUserReadNotification/:id", updateUserReadNotification);
userRoutes.get("/getAllUser", getAllUser);
userRoutes.get("/getAllPreferanceState/:id", getAllPreferanceState);
userRoutes.get("/getAllPreferanceCity/:id", getAllPreferanceCity);
userRoutes.get("/getSingleUser/:id", getSingleUser);
userRoutes.put("/updateSingleUser/:id", updateSingleUser);
userRoutes.post("/resendotp", resendotp);
userRoutes.post("/verifyotp", verifyotp);

//Feedback
userRoutes.post("/feedbacksend", feedbacksend);
userRoutes.put("/feedbackstatus/:id", feedbackstatus);

userRoutes.get("/getAllFeedback", getAllFeedback);
//Add comment
userRoutes.post("/addComment", addComment);
//push /get default user state
userRoutes.put("/PushState/:id", PushState);
userRoutes.put("/PushCity/:id", PushCity);
userRoutes.get("/getDefaultCity/:id", getDefaultCity);

module.exports = userRoutes;
