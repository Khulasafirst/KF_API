const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sendEmail = require("../utils/sendMail");
const WhatsappSend = require("../utils/WhatsappSend.js");
const { appErr, AppErr } = require("../utils/appErr.js");
var date_time = new Date();
var path = require("path");
const generateToken = require("../utils/generateToken");

const {
  Admin,
  User,
  Advertisement,
  City,
  Country,
  Comment,
  EpaperSubscriber,
  Feedback,
  News,
  NewsCategory,
  NewsSubCategory,
  Notification,
  Socialmedialinks,
  State,
  Subscriptionpayment,
  Subscriptionplans,
  Tags,
  VideoGallery,
  WebsiteContents,
  ImageGallery,
} = require("../Modal/index.js");

//Fixed Formate  for Khulasa news Project
// try{
//     if () {
//         return next(new AppErr("User Already Exist", 500));
//       }
// }
// catch(error){
// next(appErr(error.message));
// }
//============================================================
// * blg app twbt
//*********************** REGISTER ********************
//============================================================
// exports. = asyncHandler(async (req, res, next) => {
//     try {

//     } catch (error) {
//     next(appErr(error.message));
//     }
// });


//combine api for login register
exports.login_registerUserCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!phone) {
      return next(new AppErr("Please Fill  the field properly", 500));
    } else {
      const userFound = await User.findOne({ phone });
      if (userFound) {
        //generate otps start
        var otpcode = Math.floor(1000 + Math.random() * 9000);
        userFound.otp = otpcode;
        userFound.save();
        const mobile = userFound?.phone;
        const msg = `Dear Customer , OTP to login is : ${otpcode} `;
        WhatsappSend(mobile, msg);

        res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          userdata: userFound,
          token: generateToken(userFound._id),
        });
      } else {
        const userFound = await User.create({
          name,
          phone,
        });
       // const userFound = userFound._id;
        //generate otps start
        var otpcode = Math.floor(1000 + Math.random() * 9000);
        userFound.otp = otpcode;
        userFound.save();
        const mobile = userFound?.phone;
        const msg = `Dear Customer , OTP to login is : ${otpcode} `;
        WhatsappSend(mobile, msg);

        res.status(200).json({
          status: "success",
          message: "User Registered and logged in successfully",
          userdata: userFound,
          token: generateToken(userFound._id),
        });
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
});


//============================================================
//*********************Push / Update Default State**********************
//============================================================
exports.PushState = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id
    const {
      defaultstate
    } = req.body;
    const pushstate = await User.updateOne({_id:id},{defaultstate},{new:true});
 
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });

  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getAllPreferanceState = asyncHandler(async (req, res, next) => {
  try {
    const userFound = await User.findById(req.params.id).populate('defaultstate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: " Data Found",
      totadata: userFound.defaultstate.length,
      data: userFound.defaultstate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************Push / Update Default city**********************
//============================================================
exports.PushCity = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id
    const {
      defaultcity
    } = req.body;
    const defaultcity2 = await User.updateOne({_id:id},{defaultcity},{new:true});
 
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });

  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getAllPreferanceCity = asyncHandler(async (req, res, next) => {
  try {
    const userFound = await User.findById(req.params.id).populate('defaultcity')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: " Data Found",
      totadata: userFound.defaultcity.length,
      data: userFound.defaultcity,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************get  Default city**********************
//============================================================

exports.getDefaultCity = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
   
    const defaultcity2 = await User.findById(id).select('defaultcity').populate('defaultcity');
 
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
      date:defaultcity2,
    });

  } catch (error) {
    next(appErr(error.message));
  }
});

exports.registerUserCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { name, username, email, phone, password } = req.body;
    if (!name || !username || !email || !phone || !password) {
      return next(new AppErr("Please Fill All the field properly", 500));
    } else {
      const userExists = await User.findOne({ email, phone });
      if (userExists) {
        return next(new AppErr("User already exists", 422));
      } else {
        const username1 = username.toLowerCase().replace(/\s+/g, "");

        const username1Exist = await User.findOne({ username: username1 });
        if (username1Exist) {
          return next(new AppErr("User Name Already Exists", 422));
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const randomTxt = Math.random()
            .toString(36)
            .substring(7)
            .toLocaleUpperCase();
          //create the user
          const user = await User.create({
            name,
            username,
            email,
            phone,
            password: hashedPassword,
          });

          // Setup EMAIL DETAIL SEND TO USER

          const message = `
    <html>
    <body><div>
    <h2>Hello ${name}</h2>
        <p><b>Welcome to Khulasa News</b></p>  
        <p><b>YOUR ACCOUNT DETAILS :</b></p>
        <p>YOUR EMAIL ID : ${email}</p>
        <p>YOUR USER NAME : ${username}</p>
        <p>YOUR USER PASSWORD : ${password}</p>
        
        <p>Regards...</p>
        <p>KHULASA NEWS TEAM</p>
        </div></body>
        </html>   
      `;
          const subject = "KHULASA NEWS ACCOUNT DETAIL";
          const send_to = email;

          sendEmail({
            email: send_to,
            subject: subject,
            message: message,
          });
          res.status(200).json({
            status: "success",
            message: "User Registered Successfully",
            data: user,
          });
        }
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.loginUserCtrl = asyncHandler(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppErr("please filled the data", 400));
    }
    const username1 = username.toLowerCase();
    //Find the user in db by email only
    const userFound = await User.findOne({
      username: username1,
    });
    if (!userFound) {
      return next(new AppErr("User Not Found", 401));
    } else {
      const isMatch = await bcrypt.compare(password, userFound.password);

      if (!isMatch) {
        return next(new AppErr("Invalid credentials", 401));
      } else {
        //       const files = await File.find();

        //       // generate otps start
        //       var otpcode = Math.floor(1000 + Math.random() * 9000);
        //       userFound.otp = otpcode;
        //       userFound.save();
        //       const mobile = userFound?.phone;
        //       const msg = `Dear Customer , OTP to login is : ${otpcode} `;
        //       WhatsappSend(mobile, msg);

        //       const message = `
        //   <html>
        //   <body><div>
        //   <h2>Hello ${username1}</h2>
        //       <p><b>Welcome to NAMO SANDWITCH</b></p>
        //       <p><b>Dear Customer , OTP to login is : ${otpcode}</b></p>

        //       <p>Regards...</p>
        //       <p>KHULASA NEWS TEAM</p>
        //       </div></body>
        //       </html>
        //     `;
        //       const subject = "NAMO SANDWITCH OTP";
        //       const send_to = userFound.email;

        //       sendEmail({
        //         email: send_to,
        //         subject: subject,
        //         message: message,
        //       });

        // generate otp end

        res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          // url: process.env.MAIN_URL + "uploads/",
          userdata: userFound,
          // userFound: {
          //   _id: userFound?._id,
          //   email: userFound?.email,
          //   phone: userFound?.phone,
          // },
          token: generateToken(userFound._id),
        });
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.forgetpassworduser = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    const checkIsAvailable = await User.findOne({ email });

    if (!checkIsAvailable) {
      return next(new AppErr("User Not Found", 404));
    } else {
      // Create Reste Token
      const randomTxt = Math.random()
        .toString(36)
        .substring(7)
        .toLocaleUpperCase();
      const randomNumbers = Math.floor(1000 + Math.random() * 90000);
      let resetToken = randomTxt + randomNumbers;
      // save token to db START ======
      checkIsAvailable.resettoken = resetToken;
      checkIsAvailable.save();
      // save token to db END =======
      const email = checkIsAvailable?.email;
      const message = `
    <html>
    <body><div>
    <h2>Hello ${checkIsAvailable?.name}</h2>
        <p><b>RESET PASSWORD TOKEN</b></p>  
        <p>YOUR SECRET TOKEN : ${resetToken}</p>
        
        <p>Regards...</p>
        <p>KHULASA NEWS TEAM</p>
        </div></body>
        </html>   
      `;
      const subject = "KHULASA NEWS PASSWORD RESET DETAIL";
      const send_to = email;

      sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });

      res.status(200).json({
        status: "success",
        message: " User Found/Please Check Email For Secret Code",
        data: { userid: checkIsAvailable._id },
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.updatepassword = asyncHandler(async (req, res, next) => {
  try {
    const { id, newpassword, resetToken } = req.body;

    const check_id_and_reset_token = await User.findOne({
      _id: id,
      resettoken: resetToken,
    });
    if (!check_id_and_reset_token) {
      return next(new AppErr("Details Not Match", 404));
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const findandupdate = await User.findOneAndUpdate(
        { _id: id },
        { password: hashedPassword, resettoken: "" },
        { new: true }
      );
      // Finally Update details
      const email = check_id_and_reset_token?.email;
      const message = `
<html>
<body><div>
<h2>Hello ${check_id_and_reset_token?.name}</h2>
    <p><b> Password Updated Successfully ... </b></p>  
   
    <p>Regards...</p>
    <p>NAMO SANDWITCH TEAM</p>
    </div></body>
    </html>   
  `;
      const subject = "NAMO SANDWITCH PASSWORD UPDATE SUCCESSFULLY";
      const send_to = email;

      sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });

      res.status(200).json({
        status: "success",
        message: "Password Update Successfully",
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.updateInfo = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    if (req.file) {
      const imagepath = process.env.MAIN_URL + "uploads/" + req.file.filename;
      const update = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          phone,
          image: imagepath,
        },
        { new: true }
      );
    } else {
      const update = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          phone,
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getAllUser = asyncHandler(async (req, res, next) => {
  try {
    const userFound = await User.find({})
      .sort({ createdAt: -1 })
      .populate("notification.notificationid");

    res.status(200).json({
      status: "success",
      message: " Data Found",
      totadata: userFound.length,
      data: userFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  try {
    const userFound = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: userFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.updateSingleUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;
    if (password != null) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userFound = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone, email, password: hashedPassword },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        message: " Data Found",
        data: userFound,
      });
    } else {
      const userFound = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone, email },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        message: " Data Found",
        data: userFound,
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.resendotp = asyncHandler(async (req, res, next) => {
  try {
    const { userid } = req.body;
    const userFound = await User.findById(userid);
    if (userFound) {
      // generate otps start
      var otpcode = Math.floor(1000 + Math.random() * 9000);
      userFound.otp = otpcode;
      userFound.save();
      const mobile = userFound?.phone;
      const msg = `Dear Customer , OTP to login is : ${otpcode} `;
      //  WhatsappSend(mobile, msg);

      const message = `
        <html>
        <body><div>
        <h2>Hello ${userFound.name}</h2>
             
            <p><b>Dear Customer , OTP to login is : ${otpcode}</b></p>
              
            <p>Regards...</p>
            <p>KHULASA NEWS TEAM</p>
            </div></body>
            </html>   
          `;
      const subject = "KHULASA NEWS OTP";
      const send_to = userFound.email;

      sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });
      // generate otp end

      res.status(200).json({
        status: "success",
        message: "OTP Sent Successfully...",
      });
    } else {
      return next(new AppErr("Details not match.", 404));
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.verifyotp = asyncHandler(async (req, res, next) => {
  try {
    const { userid, otp } = req.body;
    const userFound = await User.findOne({ _id: userid, otp });
    if (userFound) {
      userFound.otp = "";
      userFound.save();
      res.status(200).json({
        status: "success",
        message: "OTP Verified Successfully...",
      });
    } else {
      return next(new AppErr("Details not match.", 404));
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.feedbacksend = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, mobile,message } = req.body;

    const feedbacks = await Feedback.create({
      name, email, mobile,message
    });


    
    const usermessage = `
<html>
<body><div>
<h2>Hello Admin </h2>

<p><b>Name :- ${name} </b></p> 
<p><b>Email:- ${email} </b></p> 
<p><b>Mobile:- ${mobile} </b></p> 
<p><b>Message:- ${message} </b></p>  
   
    <p>Khulasa First</p>
    </div></body>
    </html>   
  `;

    const subject = "Feedback message from user";
    const send_to = process.env.EMAIL_TO_ADDRESS;

    sendEmail({
      email: send_to,
      subject: subject,
      message: usermessage,
    });

    res.status(200).json({
      status: "success",
      message: "Feedback Submitted Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.feedbackstatus = asyncHandler(async (req, res, next) => {
  try {
   
     await Feedback.findByIdAndUpdate({
      _id:req.params.id
    },{readstatus:true},{new:true});

    res.status(200).json({
      status: "success",
      message: "Success",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//***********************ADMIN STAFF INFO ALL********************
//============================================================
exports.getAllFeedback = asyncHandler(async (req, res, next) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      TotalUsers: data.length,
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************Add Comment**********************
//============================================================
exports.addComment = asyncHandler(async (req, res, next) => {
  try {
    const {
      commentdescription,
      newsid,
      videoid,
      imagegalleryid,
      commentby,
      commentype,
    } = req.body;
    const adddata = await Comment.create({
      commentdescription,
      newsid,
      videoid,
      imagegalleryid,
      commentby,
      commentype,
    });

    const getcommentid = adddata._id;

    if (newsid) {
      const get_news_and_update = await News.updateOne(
        { _id: newsid },
        { $push: { commentId: getcommentid } },
        { new: true }
      );
    }
    if (videoid) {
      const update_to_video_comment_id = await VideoGallery.updateOne(
        { _id: videoid },
        { $push: { commentId: getcommentid } },
        { new: true }
      );
    }
    if (imagegalleryid) {
      const update_to_Image_comment_id = await ImageGallery.updateOne(
        { _id: videoid },
        { $push: { commentId: getcommentid } },
        { new: true }
      );
    }
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
// exports. = asyncHandler(async (req, res, next) => {
//     try {

//     } catch (error) {
//     next(appErr(error.message));
//     }
// });
