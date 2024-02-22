const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const fs = require("fs");
const sendEmail = require("../utils/sendMail");
const { appErr, AppErr } = require("../utils/appErr.js");
const WhatsappSend = require("../utils/WhatsappSend.js");

var date_time = new Date();
//const Admin = require("../Modal/Admin.js");
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
  Configuration,
  Epaper,
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
//***********************ADMIN  REGISTER ********************
//============================================================

exports.registerAdminCtrl = asyncHandler(async (req, res, next) => {
  const { name, username, email, phone, password, loginType, permission } =
    req.body;
  try {
    const username1 = username.toLowerCase().replace(/\s+/g, "");
    const username1Exist = await Admin.findOne({ username: username1 });
    if (username1Exist) {
      return next(new AppErr("User Name Already Exists", 422));
    }
    //Check user exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      //throw
      return next(new AppErr("User Already Exist", 500));
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user
    const admin = await Admin.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      loginType,
      permission,
    });
    res.status(200).json({
      status: "success",
      message: " Registered Successfully",
      data: admin,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//***********************ADMIN  LOGIN ********************
//============================================================

exports.loginAdminCtrl = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //Find the user in db by email only
    const adminFound = await Admin.findOne({
      email,
    });

    const isMatch = await bcrypt.compare(password, adminFound.password);

    if (adminFound && isMatch) {
      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        admindata: adminFound,
        adminFound: {
          _id: adminFound?._id,
          email: adminFound?.email,
          phone: adminFound?.phone,
        },
        token: generateToken(adminFound?._id),
      });
    } else {
      return next(new AppErr("Invalid login credentials", 401));
    }
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//***********************ADMIN UPDATE PASSWORD ********************
//============================================================

exports.updatepasswordAdmin = asyncHandler(async (req, res, next) => {
  const { id, newpassword, oldpassword } = req.body;
  try {
    const adminFound = await Admin.findOne({ _id: id });
    const isMatch = await bcrypt.compare(oldpassword, adminFound.password);
    if (adminFound && isMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const findandupdate = await Admin.findOneAndUpdate(
        { _id: id },
        { password: hashedPassword },
        { new: true }
      );
      //   // Finally Update details
      const email = adminFound?.email;
      const message = `
<html>
<body><div>
<h2>Hello ${adminFound?.name}</h2>
    <p><b> Password Updated Successfully ... </b></p>  
   
    <p>Regards...</p>
    <p>KHULASA FIRSTNEWS  TEAM</p>
    </div></body>
    </html>   
  `;
      const subject = "KHULASA FIRST NEWS PASSWORD UPDATE SUCCESSFULLY";
      const send_to = email;

      sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });

      res.status(200).json({
        status: "success",
        message: " Password Update Successfully",
      });
    } else {
      return next(new AppErr("Invalid credentials", 401));
    }
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************ADMIN STAFF INFO BY ID********************
//============================================================
exports.getstaffinfo = asyncHandler(async (req, res, next) => {
  try {
    const data = await Admin.findById(req.params.id).populate([
      "country",
      "state",
      "city",
    ]);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//***********************ADMIN STAFF INFO ALL********************
//============================================================
exports.getAllStaff = asyncHandler(async (req, res, next) => {
  try {
    const data = await Admin.find().sort({ createdAt: -1 });
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
//***********************ADMIN FORGET PASSWORD********************
//============================================================
exports.forgetpassworduser = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const checkIsAvailable = await Admin.findOne({ email });
    if (!checkIsAvailable) {
      return next(new AppErr("User Not Found", 404));
      // res.status(404).json({
      //   status: "fail",
      //   message: " User Not Found",
      // });
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
      <p>KHULASA FIRST  TEAM</p>
      </div></body>
      </html>   
    `;
      const subject = "KHULASA FIRST PASSWORD RESET DETAIL";
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

//============================================================
//***********************ADMIN UPDATE PASSWORD********************
//============================================================
exports.updatepassword = asyncHandler(async (req, res, next) => {
  try {
    const { id, newpassword, resetToken } = req.body;
    const check_id_and_reset_token = await Admin.findOne({
      _id: id,
      resettoken: resetToken,
    });

    if (!check_id_and_reset_token) {
      return next(new AppErr("Details Not Match", 404));
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const findandupdate = await Admin.findOneAndUpdate(
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
      <p>KHULASA FIRST NEWS TEAM</p>
      </div></body>
      </html>   
    `;
      const subject = "PASSWORD UPDATE SUCCESSFULLY";
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
//============================================================
//***********************ADMIN UPDATE INFO********************
//============================================================
exports.updateInfo = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    if (req.file) {
      const imagepath = process.env.MAIN_URL + "uploads/" + req.file.filename;
      const update = await Admin.findByIdAndUpdate(
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
      const update = await Admin.findByIdAndUpdate(
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
// *********************** Update SubStaff***********************
// by admin side only
exports.updateSubStaff = asyncHandler(async (req, res) => {
  try {
    const { name, username, email, phone, loginType, permission } = req.body;

    const data = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, username, email, phone, loginType, permission },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************************************
//============================================================
exports.addCountry = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const addcountry = await Country.create({
      name,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************************************
//============================================================
exports.addState = asyncHandler(async (req, res, next) => {
  try {
    const { name, countryid } = req.body;
    const addState = await State.create({
      name,
      countryid,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************************************
//============================================================

exports.addCity = asyncHandler(async (req, res, next) => {
  try {
    const { name, stateid, countryid } = req.body;
    const addcity = await City.create({
      name,
      stateid,
      countryid,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************************************
//============================================================

exports.getAllCity = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await City.find()
      .populate("stateid")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************************************
//============================================================

exports.getAllState = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await State.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************************************
//============================================================

exports.getAllCountry = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await Country.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************  getStateByCountryId********************
//============================================================
exports.getStateByCountryId = asyncHandler(async (req, res, next) => {
  try {
    const data = await State.find({ countryid: req.params.id });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************  getCityByStateId********************
//============================================================
exports.getCityByStateId = asyncHandler(async (req, res, next) => {
  try {
    const data = await City.find({ stateid: req.params.id });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************  get getCityByCountryId********************
//============================================================
exports.getCityByCountryId = asyncHandler(async (req, res, next) => {
  try {
    const data = await City.find({ countryid: req.params.id });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************  getCountryById BY ID********************
//============================================================
exports.getCountryById = asyncHandler(async (req, res, next) => {
  try {
    const data = await Country.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************getStateById BY ID********************
//============================================================
exports.getStateById = asyncHandler(async (req, res, next) => {
  try {
    const data = await State.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//***********************getCityById  BY ID********************
//============================================================
exports.getCityById = asyncHandler(async (req, res, next) => {
  try {
    const data = await City.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************UPDATE Country**********************
//============================================================

exports.updateCountryById = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const findandupdate = await Country.findOneAndUpdate(
      { _id: req.params.id },
      { name: name },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************UPDATE state**********************
//============================================================

exports.updateStateById = asyncHandler(async (req, res, next) => {
  try {
    const { name, countryid } = req.body;
    const findandupdate = await State.findOneAndUpdate(
      { _id: req.params.id },
      { name: name, countryid: countryid },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE CITY**********************
//============================================================

exports.updateCityById = asyncHandler(async (req, res, next) => {
  try {
    const { name, stateid, countryid } = req.body;
    const findandupdate = await City.findOneAndUpdate(
      { _id: req.params.id },
      { name: name, stateid: stateid, countryid: countryid },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D -  C A T E G O R Y ************************
//============================================================
exports.addCategory = asyncHandler(async (req, res, next) => {
  try {
    const { name, name2, imageurl, categoryorder } = req.body;

    const slug1 = name2.split(" ").join("-");

    const addcountry = await NewsCategory.create({
      name,
      name2,
      imageurl,
      slug: slug1,
      categoryorder,
    });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET ALL CATEGORY*******************
//============================================================

exports.getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await NewsCategory.find()
      .sort({ categoryorder: 1 })
      .collation({ locale: "en_US", numericOrdering: true });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET CATEGORY BY ID**********************
//============================================================

exports.getCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const data = await NewsCategory.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET CATEGORY BY ID**********************
//============================================================

exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  try {
    const data = await NewsCategory.findOne({ slug: req.params.slug });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE CATEGORY BY ID **********************
//============================================================

exports.updateCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const { name, name2, imageurl, categoryorder } = req.body;
    const slug1 = name2.split(" ").join("-");
    const findandupdate = await NewsCategory.findOneAndUpdate(
      { _id: req.params.id },
      { name, name2, slug: slug1, imageurl, categoryorder },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D  -  S U B  -  C A T E G O R Y ************************
//============================================================
exports.addSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { name, categoryid, imageurl } = req.body;
    const addcountry = await NewsSubCategory.create({
      name,
      categoryid,
      imageurl,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET ALL SUB CATEGORY*******************
//============================================================

exports.getAllSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await NewsSubCategory.find()
      .populate("categoryid")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET Sub CATEGORY BY ID**********************
//============================================================

exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const data = await NewsSubCategory.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET Sub CATEGORY BY ID**********************
//============================================================

exports.getSubCategoryByCategoryId = asyncHandler(async (req, res, next) => {
  try {
    const data = await NewsSubCategory.find({ categoryid: req.params.id });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************UPDATE Sub CATEGORY BY ID **********************
//============================================================

exports.updateSubCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const { name, categoryid, imageurl } = req.body;
    const findandupdate = await NewsSubCategory.findOneAndUpdate(
      { _id: req.params.id },
      { name: name, categoryid: categoryid, imageurl: imageurl },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************A D D -  T A  G S ************************
//============================================================
exports.addTags = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const tg = await Tags.create({
      name,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET ALL Tags*******************
//============================================================

exports.getAllTags = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await Tags.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************GET Tags BY ID**********************
//============================================================

exports.getTagsById = asyncHandler(async (req, res, next) => {
  try {
    const data = await Tags.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE Tags BY ID **********************
//============================================================

exports.updateTagsById = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const findandupdate = await Tags.findOneAndUpdate(
      { _id: req.params.id },
      { name: name },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D -  Subscription Plan ************************
//============================================================
exports.addSubscriptionPlan = asyncHandler(async (req, res, next) => {
  try {
    const { name, originalamount, discountedamount, days, imageurl } = req.body;
    const addcountry = await Subscriptionplans.create({
      name,
      originalamount,
      discountedamount,
      days,
      imageurl,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL getAllSubscriptionPlan*******************
//============================================================

exports.getAllSubscriptionPlan = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await Subscriptionplans.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*********************GET getSubscriptionPlanById BY ID**********************
//============================================================

exports.getSubscriptionPlanById = asyncHandler(async (req, res, next) => {
  try {
    const data = await Subscriptionplans.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE updateSubscriptionPlanById **********************
//============================================================

exports.updateSubscriptionPlanById = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const findandupdate = await Subscriptionplans.findOneAndUpdate(
      { _id: req.params.id },
      { name: name },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D -  IMAGE GALLERY ************************
//============================================================
exports.addImageGallery = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      imageurl,
      categoryid,
      subcategoryid,
      tags,
      state,
      city,
      createdby,
    } = req.body;

    const adddata = await ImageGallery.create({
      title,
      slug,
      description,
      imageurl,
      categoryid,
      subcategoryid,
      tags,
      state,
      city,
      createdby,
    });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.getAllImageGallery = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await ImageGallery.find()
      .populate({ path: "category" })
      .populate({ path: "subcategory" })
      .populate({ path: "tags" })
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET  BY ID**********************
//============================================================

exports.getImageGalleryById = asyncHandler(async (req, res, next) => {
  try {
    const data = await ImageGallery.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE  **********************
//============================================================

exports.updateImageGalleryById = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      imageurl,
      category,
      subcategory,
      tags,
      state,
      city,
      createdby,
    } = req.body;
    const findandupdate = await ImageGallery.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        slug,
        description,
        imageurl,
        category,
        subcategory,
        tags,
        state,
        city,
        createdby,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D -  IMAGE GALLERY ************************
//============================================================
exports.addVideoGallery = asyncHandler(async (req, res, next) => {
  try {
    // const {
    //   title,
    //   slug,
    //   description,
    //   videourl,
    //   categoryid,
    //   subcategoryid,
    //   tags,
    //   state,
    //   city,
    //   videotype,
    //   youtubeurl,
    //   createdby,
    // } = req.body;

    // const adddata = await VideoGallery.create({
    //   title,
    //   slug,
    //   description,
    //   videourl,
    //    categoryid,
    //    subcategoryid,
    //   tags,
    //   state,
    //   city,
    //   videotype,
    //   youtubeurl,
    //   createdby,
    // });
    const {
      title,
      slug,
      imageurl,
      description,
      videourl,
      videotype,
      youtubeurl,
      videolengthtype,
      createdby,
    } = req.body;
    const slug1 = slug.split(" ").join("-");
    const adddata = await VideoGallery.create({
      title,
      slug: slug1,
      imageurl,
      description,
      videourl,
      videotype,
      youtubeurl,
      videolengthtype,
      createdby,
    });
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================
//For Admin Side
exports.getAllVideoGallery = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await VideoGallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getAllVideoGallery_ShortLong = asyncHandler(async (req, res, next) => {
  try {
    const getdataShort = await VideoGallery.find({
      status: true,
      videolengthtype: "SHORT",
    }).sort({ createdAt: -1 });
    const getdataLong = await VideoGallery.find({
      status: true,
      videolengthtype: "LONG",
    }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: {
        shortVideo: getdataShort.length,
        longVideo: getdataLong.length,
      },
      data: { shortVideo: getdataShort, longVideo: getdataLong },
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getAllVideo_Slug_Gallery_ShortLong = asyncHandler(
  async (req, res, next) => {
    try {
      const getdataShort = await VideoGallery.find({
        status: true,
        videolengthtype: "SHORT",
      })
        .select(["slug"])
        .sort({ createdAt: -1 });

      const shortcount_length = getdataShort.length;

      const shortarray = [];
      for (let i = 0; i < shortcount_length; i++) {
        let slug = getdataShort[i].slug;
        shortarray.push(slug);
      }

      const getdataLong = await VideoGallery.find({
        status: true,
        videolengthtype: "LONG",
      })
        .select(["slug"])
        .sort({ createdAt: -1 });

      const longcount_length = getdataLong.length;
      const longarray = [];
      for (let i = 0; i < longcount_length; i++) {
        let slug = longcount_length[i].slug;
        longarray.push(slug);
      }

      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: {
          shortVideo: getdataShort.length,
          longVideo: getdataLong.length,
        },
        data: { shortarray, longarray },
        data1: { shortVideo: getdataShort, longVideo: getdataLong },
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }
);

exports.get_by_limit_AllVideoGallery_ShortLong = asyncHandler(
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const perPage = parseInt(req.query.perPage) || 12;
      const totalItems_in_Short = await VideoGallery.countDocuments({
        status: true,
        videolengthtype: "SHORT",
      });
      const totalItems_in_Long = await News.countDocuments({
        status: true,
        videolengthtype: "LONG",
      });

      const getdataShort = await VideoGallery.find({
        status: true,
        videolengthtype: "SHORT",
      })
        .skip(page * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });

      const getdataLong = await VideoGallery.find({
        status: true,
        videolengthtype: "LONG",
      })
        .skip(page * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: {
          shortVideo: getdataShort.length,
          longVideo: getdataLong.length,
        },
        currentPage: page,
        totalPages_Short: Math.ceil(totalItems_in_Short / perPage),
        totalPages_Long: Math.ceil(totalItems_in_Long / perPage),

        data: { shortVideo: getdataShort, longVideo: getdataLong },
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }
);
//============================================================
//*********************GET  BY ID**********************
//============================================================

exports.getVideoGalleryById = asyncHandler(async (req, res, next) => {
  try {
    const data = await VideoGallery.findById(req.params.id)
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        // "Country",
        "tags",
      ])
      .populate({
        path: "createdby",
        select: "name",
      })
      .populate({
        path: "commentId",
        // match:{'commentstatus':"Approved"}  ,  //Comment status match kar rah he vo hi display karaga
        populate: {
          path: "commentby",
          select: "name",
        },
      });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getVideoGalleryBy_SlugId = asyncHandler(async (req, res, next) => {
  try {
    slug: req.params.slug;
    const data = await VideoGallery.findOne({ slug: req.params.slug })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        // "Country",
        "tags",
      ])
      .populate({
        path: "createdby",
        select: "name",
      })
      .populate({
        path: "commentId",
        // match:{'commentstatus':"Approved"}  ,  //Comment status match kar rah he vo hi display karaga
        populate: {
          path: "commentby",
          select: "name",
        },
      });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE  **********************
//============================================================

exports.updateVideoGalleryById = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      slug,
      imageurl,
      description,
      videourl,
      category,
      subcategory,
      tags,
      state,
      city,
      videotype,
      youtubeurl,
      videolengthtype,
      createdby,
    } = req.body;
    const slug1 = slug.split(" ").join("-");
    const findandupdate = await VideoGallery.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        slug: slug1,
        imageurl,
        description,
        videourl,
        category,
        subcategory,
        tags,
        state,
        city,
        videotype,
        videourl,
        youtubeurl,
        videolengthtype,
        createdby,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.updateVideoStatusById = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    const findandupdate = await VideoGallery.findOneAndUpdate(
      { _id: req.params.id },
      {
        status,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************A D D -  N e w s ************************
//============================================================
exports.addNews = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      imagename,
      thumbnailImage,
      imageurl,
      categoryid,
      subcategoryid,
      state,
      city,
      country,
      tag,
      postedby,
      breakingnews,
    } = req.body;
    const newslug = slug.split(" ").join("-");
    const adddata = await News.create({
      title,
      slug: newslug,
      description,
      imagename,
      thumbnailImage,
      imageurl,
      categoryid,
      subcategoryid,
      state,
      city,
      country,
      tag,
      postedby,
      breakingnews,
    });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************A D D -  N e w s ************************
//============================================================
exports.updateNews = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      imagename,
      thumbnailImage,
      imageurl,
      categoryid,
      subcategoryid,
      state,
      city,
      country,
      tag,
      postedby,
      breakingnews,
    } = req.body;
    const newslug = slug.split(" ").join("-");
    // if(categoryid)
    // {
    //   await News.findByIdAndUpdate(req.params.id,{ $$pull: { categoryid: "" }},{new:true});
    // }
    // if(city)
    // {
    // }
    // if(tags)
    // {
    // }

    const adddata = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug: newslug,
        description,
        imagename,
        thumbnailImage,
        imageurl,
        categoryid,
        subcategoryid,
        state,
        city,
        country,
        tag: tag,
        postedby,
        breakingnews,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.updateNewsStatus = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isapproved } = req.body;
    const findandupdate = await News.updateOne(
      { _id: id },
      { isapproved: isapproved },
      { new: true }
    );
    //
    // if (getdata == '') {
    //   return next(new AppErr("No Data Found", 404));
    // }
    res.status(200).json({
      status: "success",
      message: " Data Found",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.updateNewsOrder = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { orderby } = req.body;
    const findandupdate = await News.findOneAndUpdate(
      { _id: id },
      { orderby: orderby === "REMOVE" ? null : orderby },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: " Data Found",
      findandupdate,
      orderby,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getOrderedNews = asyncHandler(async (req, res, next) => {
  try {
    const get = await News.find({
      isapproved: "Approved",
      orderby: { $ne: null },
    })
      .sort({ orderby: 1 })
      .limit(100);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: get.length,
      data: get,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.updateNewsBreakingnews = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { breakingnews } = req.body;
    const findandupdate = await News.updateOne(
      { _id: id },
      { breakingnews },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: " Data Found",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL New Frontend*******************
//============================================================

exports.getAllNews = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({ isapproved: "Approved" })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .sort({ createdAt: -1 });
    //
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
// Admin Side
exports.getAllNews_Admin_Side = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;

    const totalItems = await News.countDocuments();

    const getdata = await News.find()
      .skip(page * perPage)
      .limit(perPage)
      .populate([
        "categoryid",
        //"subcategoryid",
        // "state",
        // "city",
        // "country",
        // "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .select([
        "_id",
        "title",
        "categoryid",
        "isapproved",
        "timestamps",
        "createdAt",
      ])
      .sort({ createdAt: -1 });
    //
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }

    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
      currentPage: page,
      totalPages: Math.ceil(totalItems / perPage),
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

// exports.getAllNews_Admin_Side = asyncHandler(async (req, res, next) => {
//   try {

//     const page = parseInt(req.query.page) || 1;
//   const perPage = parseInt(req.query.perPage) || 10;

//    const totalItems = await News.countDocuments();
//   // const data = await Data.find()
//   //   .skip((page - 1) * perPage)
//   //   .limit(perPage);
//     const getdata = await News.find().allowDiskUse(true).skip((page - 1) * perPage)
//        .limit(perPage)
//       .populate([
//         "categoryid",
//         //"subcategoryid",
//         // "state",
//         // "city",
//         // "country",
//         // "tags",
//       ])
//       .populate({
//         path: "postedby",
//         select: "name",
//       }).select(['_id','title','categoryid','isapproved','timestamps','createdAt'])
//       .sort({ createdAt: -1 });
//     //
//     if (getdata == "") {
//       return next(new AppErr("No Data Found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       message: " Data Found",
//       length: getdata.length,
//       data: getdata,
//         currentPage: page,
//       totalPages: Math.ceil(totalItems / perPage)
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// });

//============================================================
//************************GET News by  id*******************
//============================================================

exports.getSingleNewsById = asyncHandler(async (req, res, next) => {
  //  1)Comments approve hone par hi display hogi
  try {
    const getdata = await News.findById(req.params.id)
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .populate({
        path: "commentId",
        // match:{'commentstatus':"Approved"}  ,  //Comment status match kar rah he vo hi display karaga
        populate: {
          path: "commentby",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getSingleNewsBySlugId = asyncHandler(async (req, res, next) => {
  //  1)Comments approve hone par hi display hogi
  try {
    // const getdata = await News.findOne({slug:req.params.slug})
    const getdata = await News.findOne({
      slug: req.params.slug + req.params[0],
    })
      //  const getdata = await News.find({ "slug": { "$regex": req.params.slug, "$options": "i" }} )
      //const getdata = await News.find({ "slug": { "$regex": req.params.slug, "$options": "i" }} )

      .populate([
        "categoryid",
        // "subcategoryid",
        // "state",
        // "city",
        // "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .select([
        "_id",
        "title",
        "slug",
        "description",
        "imageurl",
        "categoryid",
        "timestamps",
        "createdAt",
      ])
      // .populate({
      //   path: "commentId",
      //   // match:{'commentstatus':"Approved"}  ,  //Comment status match kar rah he vo hi display karaga
      //   populate: {
      //     path: "commentby",
      //     select: "name",
      //   },
      // })
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET News by Category id*******************
//============================================================

exports.getNewsByCategoryId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({
      "categoryid._id": req.params.id,
      isapproved: "Approved",
    })
      .limit("200")
      .populate([
        "categoryid",
        // "subcategoryid",
        // "state",
        // "city",
        // "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .select([
        "_id",
        "title",
        "slug",
        "imageurl",
        "categoryid",
        "date",
        "createdAt",
      ])
      .sort({ createdAt: -1 });
    if (getdata == "") {
      //return next(new AppErr("No Data Found", 404));
      res.status(200).json({
        status: "success",
        message: " No Data Found",
        length: getdata.length,
        data: getdata,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: getdata.length,
        data: getdata,
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getReleatedNewsByCategoryId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({ "categoryid._id": req.params.id })
      .populate([
        "categoryid",
        //"subcategoryid",
        // "state",
        // "city",
        // "country",
        // "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .select(["_id", "title", "slug", "imageurl", "categoryid"])
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET News by  Sub Category id*******************
//============================================================

exports.getNewsBySubCategoryId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({
      subcategoryid: req.params.id,
      isapproved: "Approved",
    })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET News by City*******************
//============================================================

exports.getNewsByCityId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({
      city: req.params.id,
      isapproved: "Approved",
    })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//************************GET News by State*******************
//============================================================

exports.getNewsByStateId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({
      state: req.params.id,
      isapproved: "Approved",
    })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      })
      .sort({ createdAt: -1 });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET News by Tage*******************
//============================================================

exports.getNewsByTagsId = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await News.find({
      tags: { $all: req.params.id },
      isapproved: "Approved",
    })
      .populate([
        "categoryid",
        "subcategoryid",
        "state",
        "city",
        "country",
        "tags",
      ])
      .populate({
        path: "postedby",
        select: "name",
      });
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.getAllComments = asyncHandler(async (req, res, next) => {
  try {
    // .populate(['videoid','imagegalleryid','commentby','newsid','country','tags']).populate({
    //   path: 'commentby',
    //   select: 'name'
    // })

    const getdata = await Comment.find()
      .populate(["videoid", "imagegalleryid", "newsid"])
      .populate({
        path: "commentby",
        select: "name",
      })
      .sort({ createdAt: -1 });
    //
    if (getdata == "") {
      return next(new AppErr("No Data Found", 404));
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.updateCommentStatus = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { commentstatus } = req.body;
    const findandupdate = await Comment.updateOne(
      { _id: id },
      { commentstatus: commentstatus },
      { new: true }
    );
    //
    // if (getdata == '') {
    //   return next(new AppErr("No Data Found", 404));
    // }
    res.status(200).json({
      status: "success",
      message: " Data Found",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET FRONTEND  CATEGORY*******************
//============================================================

exports.getFrontendCategory = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await NewsCategory.find()
      .sort({ categoryorder: 1, id: -1 })
      .collation({ locale: "en_US", numericOrdering: true });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET FRONTEND  News******************
//============================================================
// exports.getMainFrontendNews = asyncHandler(async (req, res, next) => {
//   try {
//     const { All, city, state, categoryid, limit } = req.body;
//     let productQuery;

//     if (!limit) {
//       limit = 100;
//     }
//     if (All) {
//       productQuery = await News.find({ isapproved: "Approved" })
//         .limit(limit)
//         .select(["_id", "title", "slug", "imageurl", "categoryid","thumbnailImage","orderby"])
//         .sort({
//           createdAt: -1,
//           id: -1,

//         });
//       // let productQuery = await News.find({ isapproved:"Approved", categoryid:{$in:categoryid }}).sort({ createdAt: -1 });
//     }

//     if (state) {
//       productQuery = await News.find({
//         isapproved: "Approved",
//         state: { $in: state },
//       })
//         .limit(limit)
//         .select(["_id", "title", "slug", "imageurl", "categoryid","thumbnailImage"])
//         .sort({ createdAt: -1, id: -1 });
//     }

//     if (categoryid) {
//       productQuery = await News.find({
//         isapproved: "Approved",
//         "categoryid._id": categoryid,
//       })
//         .limit(limit)
//         .select(["_id", "title", "slug", "imageurl", "categoryid","thumbnailImage"])
//         .sort({ createdAt: -1, id: -1 });
//     }
//     // if (categoryid) {
//     //   productQuery = await News.find({'categoryid._id': categoryid}).sort({ createdAt: -1 });
//     // }
//     res.status(200).json({
//       status: "success",
//       message: " Data Found",
//       length: productQuery.length,
//       data: productQuery,
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// });
exports.getMainFrontendNews = asyncHandler(async (req, res, next) => {
  try {
    const { All, city, state, categoryid, limit } = req.body;
    let productQuery;
    let ordereddata;
    if (!limit) {
      limit = 100;
    }
    if (All) {
      productQuery = await News.find({ isapproved: "Approved" })
        .limit(limit)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
          "orderby",
        ])
        .sort({
          createdAt: -1,
          id: -1,
        });

      // let productQuery = await News.find({ isapproved:"Approved", categoryid:{$in:categoryid }}).sort({ createdAt: -1 });
    }

    if (state) {
      productQuery = await News.find({
        isapproved: "Approved",
        state: { $in: state },
      })
        .limit(limit)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
        ])
        .sort({ createdAt: -1, id: -1 });
    }

    if (categoryid) {
      productQuery = await News.find({
        isapproved: "Approved",
        "categoryid._id": categoryid,
      })
        .limit(limit)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
        ])
        .sort({ createdAt: -1, id: -1 });
    }
    // if (categoryid) {
    //   productQuery = await News.find({'categoryid._id': categoryid}).sort({ createdAt: -1 });
    // }
    if (!categoryid && !state) {
      ordereddata = await News.find({
        isapproved: "Approved",
        orderby: { $ne: null },
      }).sort({ orderby: 1 });
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: productQuery.length,
      data: productQuery,
      ordereddata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getMainFrontendNews_mobile = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    //  const perPage = parseInt(req.query.perPage) || 5;
    const perPage = 5;
    const { All, city, state, categoryid, limit } = req.body;

    //  ==============================
    if (All) {
      const totalItems_All = await News.countDocuments({
        isapproved: "Approved",
      });
      const productQuery = await News.find({ isapproved: "Approved" })
        .skip(page * perPage)
        .limit(perPage)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
        ])
        .sort({
          createdAt: -1,
          id: -1,
        });
      const last_page = Math.ceil(totalItems_All / perPage);
      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: productQuery.length,
        data: productQuery,
        currentPage: page,
        totalPages: last_page > 350 ? 350 : last_page,
      });
    }
    //  =========================

    if (state) {
      const productQuery = await News.find({
        isapproved: "Approved",
        state: { $in: state },
      })
        .skip(page * perPage)
        .limit(perPage)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
        ])
        .sort({ createdAt: -1, id: -1 });

      const totalItems_State = await News.countDocuments({
        isapproved: "Approved",
        state: { $in: state },
      });
      const last_page = Math.ceil(totalItems_State / perPage);
      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: productQuery.length,
        data: productQuery,
        currentPage: page,
        totalPages: last_page > 350 ? 350 : last_page,
      });
    }

    if (categoryid) {
      const productQuery = await News.find({
        isapproved: "Approved",
        "categoryid._id": categoryid,
      })
        .skip(page * perPage)
        .limit(limit)
        .select([
          "_id",
          "title",
          "slug",
          "imageurl",
          "categoryid",
          "thumbnailImage",
        ])
        .sort({ createdAt: -1, id: -1 });
      const totalItems_categoryid = await News.countDocuments({
        isapproved: "Approved",
        "categoryid._id": categoryid,
      });
      const last_page = Math.ceil(totalItems_categoryid / perPage);
      res.status(200).json({
        status: "success",
        message: " Data Found",
        length: productQuery.length,
        data: productQuery,
        currentPage: page,
        totalPages: last_page > 350 ? 350 : last_page,
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//******************* combined 3 apis ************************
//============================================================
exports.getRightBottomFrontendNews = asyncHandler(async (req, res, next) => {
  try {
    const limit = 10;
    const configRight = await Configuration.find({
      PortionData: "RightSide",
      status: true,
    }).limit(limit);
    const configBottom = await Configuration.find({
      PortionData: "BottomSide",
      status: true,
    }).limit(limit);

    const configRightLength = configRight.length;
    const configBottomLength = configBottom.length;

    const arrayRightData = [];
    const arrayBottomData = [];

    // For right side query
    for (let i = 0; i < configRightLength; i++) {
      let DisplayNewsType = configRight[i].DisplayNewsBy;
      if (DisplayNewsType === "All") {
        const array1 = await News.find({ isapproved: "Approved" })
          .limit(limit)
          .select([
            "_id",
            "title",
            "slug",
            "imageurl",
            "categoryid",
            "thumbnailImage",
          ])
          .sort({
            createdAt: -1,
            id: -1,
          });
        arrayRightData.push({ title: configRight[i].title, data: array1 });
      } else {
        let categoryid = configRight[i].activeId;
        const array1 = await News.find({
          isapproved: "Approved",
          "categoryid._id": categoryid,
        })
          .limit(limit)
          .select(["_id", "title", "slug", "imageurl", "categoryid"])
          .sort({ createdAt: -1, id: -1 });
        arrayRightData.push({ title: configRight[i].title, data: array1 });
      }
      //let query = await News.find({ isapproved: "Approved",categoryid:{$in:categoryid } }).sort({createdAt: -1,});
    }

    //For Bottom Side Query

    for (let i = 0; i < configBottomLength; i++) {
      let DisplayNewsType = configBottom[i].DisplayNewsBy;
      if (DisplayNewsType === "All") {
        const array1 = await News.find({ isapproved: "Approved" })
          .limit(limit)
          .select(["_id", "title", "slug", "imageurl", "categoryid"])
          .sort({
            createdAt: -1,
            id: -1,
          });
        arrayBottomData.push({ title: configBottom[i].title, data: array1 });
      } else {
        let categoryid = configBottom[i].activeId;
        const array1 = await News.find({
          isapproved: "Approved",
          "categoryid._id": categoryid,
        })
          .limit(limit)
          .select(["_id", "title", "slug", "imageurl", "categoryid"])
          .sort({ createdAt: -1, id: -1 });
        arrayBottomData.push({ title: configBottom[i].title, data: array1 });
      }
      //let query = await News.find({ isapproved: "Approved",categoryid:{$in:categoryid } }).sort({createdAt: -1,});
    }

    let productQuery;
    // if (All) {
    //   productQuery = await News.find({ isapproved: "Approved" }).sort({
    //     createdAt: -1,
    //   });
    //   // let productQuery = await News.find({ isapproved:"Approved", categoryid:{$in:categoryid }}).sort({ createdAt: -1 });
    // }

    // if (city) {
    //   productQuery = await News.find({
    //     isapproved: "Approved",
    //     city: { $in: city },
    //   }).sort({ createdAt: -1 });
    // }

    // if (state) {
    //   productQuery = await News.find({
    //     isapproved: "Approved",
    //     state: { $in: state },
    //   }).sort({ createdAt: -1 });
    // }

    // if (categoryid) {
    //   productQuery = await News.find({
    //     isapproved: "Approved",
    //     categoryid: { $in: categoryid },
    //   }).sort({ createdAt: -1 });
    // }

    res.status(200).json({
      status: "success",
      message: " Data Found",
      arrayRightData,
      arrayBottomData,
      length: {
        configRightLength,
        configBottomLength,
      },
      // configRight,
      // configBottom,
      // length: productQuery.length,
      // data: productQuery,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getRightBottomFrontendNews_onlyRight = asyncHandler(
  async (req, res, next) => {
    try {
      const limit = 10;
      const configRight = await Configuration.find({
        PortionData: "RightSide",
        status: true,
      }).limit(limit);

      const configRightLength = configRight.length;

      const arrayRightData = [];

      // For right side query
      for (let i = 0; i < configRightLength; i++) {
        let DisplayNewsType = configRight[i].DisplayNewsBy;
        if (DisplayNewsType === "All") {
          const array1 = await News.find({ isapproved: "Approved" })
            .limit(limit)
            .select([
              "_id",
              "title",
              "slug",
              "imageurl",
              "categoryid",
              "thumbnailImage",
            ])
            .sort({
              createdAt: -1,
              id: -1,
            });
          arrayRightData.push({ title: configRight[i].title, data: array1 });
        } else {
          let categoryid = configRight[i].activeId;
          const array1 = await News.find({
            isapproved: "Approved",
            "categoryid._id": categoryid,
          })
            .limit(limit)
            .select([
              "_id",
              "title",
              "slug",
              "imageurl",
              "categoryid",
              "thumbnailImage",
            ])
            .sort({ createdAt: -1, id: -1 });
          arrayRightData.push({ title: configRight[i].title, data: array1 });
        }
      }

      //For Bottom Side Query

      let productQuery;

      res.status(200).json({
        status: "success",
        message: " Data Found",
        arrayRightData,

        length: {
          configRightLength,
        },
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }
);

exports.getRightBottomFrontendNews_onlyBottom = asyncHandler(
  async (req, res, next) => {
    try {
      const limit = 10;

      const configBottom = await Configuration.find({
        PortionData: "BottomSide",
        status: true,
      }).limit(limit);

      const configBottomLength = configBottom.length;

      const arrayBottomData = [];

      //For Bottom Side Query

      for (let i = 0; i < configBottomLength; i++) {
        let DisplayNewsType = configBottom[i].DisplayNewsBy;
        if (DisplayNewsType === "All") {
          const array1 = await News.find({ isapproved: "Approved" })
            .limit(limit)
            .select([
              "_id",
              "title",
              "slug",
              "imageurl",
              "categoryid",
              "thumbnailImage",
            ])
            .sort({
              createdAt: -1,
              id: -1,
            });
          arrayBottomData.push({ title: configBottom[i].title, data: array1 });
        } else {
          let categoryid = configBottom[i].activeId;
          const array1 = await News.find({
            isapproved: "Approved",
            "categoryid._id": categoryid,
          })
            .limit(limit)
            .select([
              "_id",
              "title",
              "slug",
              "imageurl",
              "categoryid",
              "thumbnailImage",
            ])
            .sort({ createdAt: -1, id: -1 });
          arrayBottomData.push({ title: configBottom[i].title, data: array1 });
        }
      }

      let productQuery;

      res.status(200).json({
        status: "success",
        message: " Data Found",

        arrayBottomData,
        length: {
          configBottomLength,
        },
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }
);

//============================================================
//******************* Add configuration************************
//============================================================
exports.addConfiguration = asyncHandler(async (req, res, next) => {
  try {
    const { title, PortionData, DisplayNewsBy, activeId } = req.body;
    if (DisplayNewsBy != "All") {
      await Configuration.create({
        title,
        PortionData,
        DisplayNewsBy,
        activeId,
      });
    } else {
      await Configuration.create({
        title,
        PortionData,
        DisplayNewsBy,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//******************* get configuration************************
//============================================================
exports.getConfigurationAdminSide = asyncHandler(async (req, res, next) => {
  try {
    const getdata = await Configuration.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
      length: getdata.length,
      data: getdata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//******************* get single configuration************************
//============================================================
exports.getSingleConfigurationAdminSide = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params.id;
      const getdata = await Configuration.findById(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Created Successfully",
        length: getdata.length,
        data: getdata,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  }
);

//============================================================
//******************* Update configuration************************
//============================================================
exports.updateConfiguration = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, PortionData, DisplayNewsBy, activeId } = req.body;
    if (DisplayNewsBy != "All") {
      const findandupdate = await Configuration.findOneAndUpdate(
        { _id: id },
        { title, PortionData, DisplayNewsBy, activeId },
        { new: true }
      );
    } else {
      const act = null;
      const findandupdate = await Configuration.findOneAndUpdate(
        { _id: id },
        { title, PortionData, DisplayNewsBy, activeId: act },
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

exports.updateConfigurationStatus = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const findandupdate = await Configuration.updateOne(
      { _id: id },
      { status: status },
      { new: true }
    );
    //
    // if (getdata == '') {
    //   return next(new AppErr("No Data Found", 404));
    // }
    res.status(200).json({
      status: "success",
      message: " Data Found",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************************************
//============================================================

exports.imageUpload = asyncHandler(async (req, res, next) => {
  try {
    const Url = process.env.MAIN_URL + "uploads/images/" + req.file.filename;
    const filename = req.file.filename;
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
      imagename: filename,
      url: Url,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*******************************************
//============================================================

exports.videoUpload = asyncHandler(async (req, res, next) => {
  try {
    const Url = process.env.MAIN_URL + "uploads/video/" + req.file.filename;
    const filename = req.file.filename;
    res.status(200).json({
      status: "success",
      message: "Created Successfully",
      filename: filename,
      url: Url,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.Dashboardinfo = asyncHandler(async (req, res, next) => {
  try {
    const totalNews = await News.count({});
    const totalUser = await User.count({});
    const totalSubStaff = await Admin.count({});
    const totalCategories = await NewsCategory.count({});
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: { totalNews, totalUser, totalSubStaff, totalCategories },
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//*******************A D D -  IMAGE  ************************
//============================================================
exports.addadvertisement = asyncHandler(async (req, res, next) => {
  try {
    const { title, description, adv_url, advttype, url, advtposition } =
      req.body;

    const adddata = await Advertisement.create({
      title,
      description,
      adv_url,
      advttype,
      url,
      advtposition,
    });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//============================================================
//************************GET ALL*******************
//============================================================

exports.getAlladvertisement = asyncHandler(async (req, res, next) => {
  try {
    const getAll = await Advertisement.find({}).sort({ createdAt: -1 });

    const getTopdata = await Advertisement.find({
      advtposition: "TOP",
      status: "true",
    }).sort({ createdAt: -1 });
    const getBottomdata = await Advertisement.find({
      advtposition: "BOTTOM",
      status: "true",
    }).sort({ createdAt: -1 });
    const getRightdata = await Advertisement.find({
      advtposition: "RIGHT",
      status: "true",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: " Data Found",
      length: {
        getAll: getAll,
        TopSide: getTopdata.length,
        BottomSide: getBottomdata.length,
        RightSide: getRightdata.length,
      },
      data: getAll,
      data2: {
        TopSide: getTopdata,
        BottomSide: getBottomdata,
        RightSide: getRightdata,
      },
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************GET  BY ID**********************
//============================================================

exports.getadvertisementById = asyncHandler(async (req, res, next) => {
  try {
    const data = await Advertisement.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
//============================================================
//*********************UPDATE  **********************
//============================================================

exports.updateadvertisementById = asyncHandler(async (req, res, next) => {
  try {
    const { title, description, adv_url, advttype, url, advtposition } =
      req.body;
    const findandupdate = await Advertisement.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        description,
        adv_url,
        advttype,
        url,
        advtposition,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.updateadvertisementStatusById = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    const findandupdate = await Advertisement.findOneAndUpdate(
      { _id: req.params.id },
      {
        status,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: " Data update successfully",
      data: findandupdate,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.addPaper = asyncHandler(async (req, res, next) => {
  try {
    const { title,description,other,category,paperdate, paperimages } = req.body;
    const randomTxt = Math.random()
      .toString(36)
      .substring(7)
      .toLocaleUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 90000);
    const uniquepaperid = randomTxt + randomNumbers;
    
// if (samedateexist) {
//   //throw
//   return next(new AppErr("Already Exist", 500));
// }

    const adddata = await Epaper.create({
      title,description,other,category,paperdate,uniquepaperid
    });

    res.status(200).json({
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.uploaddailypaperpages = asyncHandler(async (req, res, next) => {
  try {
    const { paperid,pagenumber,title,description, mainimage_url } = req.body;
  
   // const paperget = await Epaper.findById(paperid);

const insertsubimages={pagenumber,mainimage_url,title,description}

const updateddata = await Epaper.updateOne(
  { _id: paperid },
  { $push: { paperimages: insertsubimages } },{new:true}
);


    res.status(200).json({
      updateddata,
      status: "success",
      message: "Created Successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

//Original Copy=====
// exports.addPaper = asyncHandler(async (req, res, next) => {
//   try {
//     const { paperdate,uniquepaperid,paperimages } = req.body;

//     const adddata = await Epaper.create({
//       paperdate,uniquepaperid,paperimages
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Created Successfully",
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// });

exports.getepaperPages = asyncHandler(async (req, res, next) => {
  try {
    const data = await Epaper.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
exports.getSinglpaper = asyncHandler(async (req, res, next) => {
  try {
    const data = await Epaper.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Data Found",
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.deletemainedition = asyncHandler(async (req, res, next) => {
  try {
    const data = await Epaper.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: " Delete Successfully",     
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.deleteeditionsubpages = asyncHandler(async (req, res, next) => {
  try {
    const data = await Epaper.findByIdAndUpdate({_id:req.params.id},{$pull:{paperimages:{_id:req.params.subid}}});
    res.status(200).json({
      status: "success",
      message: " Delete Successfully",     
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

exports.getsearchdataresult = asyncHandler(async (req, res, next) => {
  try {
    const keyword = req.params.word;
    const data = await News.aggregate([
      { $match: { slug: { $regex: keyword, $options: "i" } } },
      { $sort: { createdAt: -1 } }, // Sort in descending order by createdAt
      { $limit: 10 },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found",
      length: data.length,
      data: data,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});
// Working 100 % with ordered news and frontend news
exports.frontend_Mainnews_and_fixedorder_news = asyncHandler(async (req, res, next) => {
  try {
    const { All, city, state, categoryid, limit } = req.body;
    if (!limit) {
      limit = 100;
    }
    const frontmainnews = await News.find({ isapproved: "Approved" })
      .limit(limit)
      .select([
        "_id",
        "title",
        "slug",
        "imageurl",
        "categoryid",
        "thumbnailImage",
        "orderby",
      ])
      .sort({
        createdAt: -1,
        id: -1,
      });

    const getorderednews = await News.find({
      isapproved: "Approved",
      orderby: { $ne: null },
    })
      .sort({ orderby: 1 })
      .limit(100);

    const productQuery = getorderednews.concat(frontmainnews);
    const activeIds = [];
    const finaldata = [];
    for (let i = 0; i < productQuery.length; i++) {
      const id = productQuery[i].slug;
      const fulldata = productQuery[i];
      if (activeIds.includes(id)) {
      } else {
        activeIds.push(id);
        finaldata.push(fulldata);
      }
    }
    res.status(200).json({
      status: "success",
      message: " Data Found",
      // activeIds,
      getorderednews: getorderednews.length,
      frontmainnews: frontmainnews.length,
      length: finaldata.length,
      data: finaldata,
    });
  } catch (error) {
    next(appErr(error.message));
  }
});

