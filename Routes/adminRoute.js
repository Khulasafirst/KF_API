const express = require("express");
const {
  registerAdminCtrl,
  loginAdminCtrl,
  updatepasswordAdmin,updateSubStaff,
  getstaffinfo,
  getAllStaff,
  forgetpassworduser,
  updatepassword,
  updateInfo,
  addCountry,
  addState,
  addCity,
  getAllCountry,
  getAllState,
  getAllCity,
  getCountryById,
  getStateById,
  getCityById,
  updateCountryById,
  updateStateById,
  updateCityById,
  addCategory,
  getAllCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  addSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  addTags,
  getAllTags,
  getTagsById,
  updateTagsById,
  addSubscriptionPlan,
  getAllSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlanById,
  addImageGallery,
  getAllImageGallery,
  getImageGalleryById,
  updateImageGalleryById,
  addVideoGallery,
  getAllVideoGallery,getAllVideoGallery_ShortLong,
  getAllVideo_Slug_Gallery_ShortLong,
  updateVideoStatusById,
  getVideoGalleryById,getVideoGalleryBy_SlugId,
  updateVideoGalleryById,
  addNews,getAllNews,getAllNews_Admin_Side,getSingleNewsById,getSingleNewsBySlugId,getNewsByCategoryId,
   getReleatedNewsByCategoryId,getSubCategoryByCategoryId,
  getNewsBySubCategoryId,getNewsByCityId,getNewsByStateId,getNewsByTagsId,
  getAllComments,updateCommentStatus,getStateByCountryId,getCityByStateId,
  getCityByCountryId,updateNewsStatus,updateNewsBreakingnews,
  
  getFrontendCategory,getMainFrontendNews,getMainFrontendNews_mobile,getRightBottomFrontendNews,getRightBottomFrontendNews_onlyRight,getRightBottomFrontendNews_onlyBottom,
  addConfiguration,getConfigurationAdminSide,updateConfigurationStatus,getSingleConfigurationAdminSide,updateConfiguration,updateNews,
  imageUpload,videoUpload,Dashboardinfo,
  addadvertisement,getAlladvertisement,getadvertisementById,updateadvertisementById,updateadvertisementStatusById,
  addPaper,deletemainedition,deleteeditionsubpages,uploaddailypaperpages,getepaperPages,getSinglpaper,get_by_limit_AllVideoGallery_ShortLong,getsearchdataresult,updateNewsOrder,getOrderedNews,frontend_Mainnews_and_fixedorder_news,


} = require("../Controller/adminCtrl.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

const adminRoute = express.Router();

//====================================================
// =================== R O U T E =====================
//====================================================

adminRoute.post("/register", registerAdminCtrl);



adminRoute.post("/login", loginAdminCtrl);
adminRoute.patch("/updatepasswordAdmin", updatepasswordAdmin);
adminRoute.get("/getstaffinfo/:id", getstaffinfo);
adminRoute.get("/getAllStaff", getAllStaff);
adminRoute.put("/updateSubStaff/:id", updateSubStaff);
// update details
adminRoute.post("/forgetpassword", forgetpassworduser);
adminRoute.post("/updatepassword", updatepassword);
adminRoute.put("/updateInfo/:id", updateInfo);

// country state city
adminRoute.post("/country", addCountry);
adminRoute.post("/state", addState);
adminRoute.post("/city", addCity);

adminRoute.get("/getAllCountry", getAllCountry);
adminRoute.get("/getAllState", getAllState);
adminRoute.get("/getAllCity", getAllCity);

adminRoute.get("/getCountryById/:id", getCountryById);
adminRoute.get("/getStateById/:id", getStateById);
adminRoute.get("/getCityById/:id", getCityById);

adminRoute.patch("/updateCountryById/:id", updateCountryById);
adminRoute.patch("/updateStateById/:id", updateStateById);
adminRoute.patch("/updateCityById/:id", updateCityById);


adminRoute.get("/getStateByCountryId/:id", getStateByCountryId);
adminRoute.get("/getCityByStateId/:id", getCityByStateId);
adminRoute.get("/getCityByCountryId/:id", getCityByCountryId);

// CATEGORY
adminRoute.post("/addCategory", addCategory);
adminRoute.get("/getAllCategory", getAllCategory);
adminRoute.get("/getCategoryById/:id", getCategoryById);
adminRoute.get("/getCategoryBySlug/:slug", getCategoryBySlug);
adminRoute.put("/updateCategoryById/:id", updateCategoryById);

// SUB CATEGORY  addSubCategory,getAllSubCategory,getSubCategoryById,updateSubCategoryById
adminRoute.post("/addSubCategory", addSubCategory);
adminRoute.get("/getAllSubCategory", getAllSubCategory);
adminRoute.get("/getSubCategoryById/:id", getSubCategoryById);
adminRoute.get("/getSubCategoryByCategoryId/:id", getSubCategoryByCategoryId);
adminRoute.put("/updateSubCategoryById/:id", updateSubCategoryById);

// TAGS addTags ,getAllTags,getTagsById,updateTagsById
adminRoute.post("/addTags", addTags);
adminRoute.get("/getAllTags", getAllTags);
adminRoute.get("/getTagsById/:id", getTagsById);
adminRoute.put("/updateTagsById/:id", updateTagsById);

// SUBSCRIPTION PLANS addSubscriptionPlan,getAllSubscriptionPlan,getSubscriptionPlanById,updateSubscriptionPlanById
adminRoute.post("/addSubscriptionPlan", addSubscriptionPlan);
adminRoute.get("/getAllSubscriptionPlan", getAllSubscriptionPlan);
adminRoute.get("/getSubscriptionPlanById/:id", getSubscriptionPlanById);
adminRoute.put("/updateSubscriptionPlanById/:id", updateSubscriptionPlanById);

//ADD GALLERY  addImageGallery,getAllImageGallery,getImageGalleryById,updateImageGalleryById

adminRoute.post("/addImageGallery", addImageGallery);
adminRoute.get("/getAllImageGallery", getAllImageGallery);
adminRoute.get("/getImageGalleryById/:id", getImageGalleryById);
adminRoute.put("/updateImageGalleryById/:id", updateImageGalleryById);

//ADD Video GALLERY addVideoGallery,getAllVideoGallery,getVideoGalleryById,updateVideoGalleryById

adminRoute.post("/addVideoGallery", addVideoGallery);
adminRoute.get("/getAllVideoGallery", getAllVideoGallery);
adminRoute.get("/getAllVideoGallery_ShortLong", getAllVideoGallery_ShortLong);
adminRoute.get("/getAllVideo_Slug_Gallery_ShortLong", getAllVideo_Slug_Gallery_ShortLong);

adminRoute.get("/get_by_limit_AllVideoGallery_ShortLong", get_by_limit_AllVideoGallery_ShortLong);
adminRoute.get("/getVideoGalleryById/:id", getVideoGalleryById);
adminRoute.get("/getVideoGalleryBy_SlugId/:slug", getVideoGalleryBy_SlugId);

adminRoute.put("/updateVideoGalleryById/:id", updateVideoGalleryById);

adminRoute.put("/updateVideoStatusById/:id", updateVideoStatusById);
//News
adminRoute.post("/addNews", addNews);
adminRoute.put("/updateNewsStatus/:id", updateNewsStatus);
adminRoute.put("/updateNewsOrder/:id", updateNewsOrder);
adminRoute.get("/getOrderedNews", getOrderedNews);
adminRoute.put("/updateNews/:id", updateNews);
adminRoute.put("/updateNewsBreakingnews/:id", updateNewsBreakingnews);

adminRoute.get("/getAllNews", getAllNews);
adminRoute.get("/getAllNews_Admin_Side", getAllNews_Admin_Side);
adminRoute.get("/getSingleNewsById/:id", getSingleNewsById);
adminRoute.get("/getSingleNewsBySlugId/:slug*", getSingleNewsBySlugId);
adminRoute.get("/getNewsByCategoryId/:id", getNewsByCategoryId);

adminRoute.get("/getReleatedNewsByCategoryId/:id", getReleatedNewsByCategoryId);

adminRoute.get("/getNewsBySubCategoryId/:id", getNewsBySubCategoryId);
adminRoute.get("/getNewsByCityId/:id", getNewsByCityId);
adminRoute.get("/getNewsByStateId/:id", getNewsByStateId);
adminRoute.get("/getNewsByTagsId/:id", getNewsByTagsId);

//Comment

adminRoute.get("/getAllComments", getAllComments);
adminRoute.put("/updateCommentStatus/:id", updateCommentStatus);


//Frontend Api Call
adminRoute.get("/getFrontendCategory",getFrontendCategory);
adminRoute.post("/getMainFrontendNews",getMainFrontendNews);
adminRoute.post("/getMainFrontendNews_mobile",getMainFrontendNews_mobile);

//Configuration
adminRoute.post("/addConfiguration",addConfiguration);
adminRoute.get("/getConfigurationAdminSide",getConfigurationAdminSide);
adminRoute.get("/getSingleConfigurationAdminSide/:id",getSingleConfigurationAdminSide);
adminRoute.put("/updateConfiguration/:id",updateConfiguration);
adminRoute.put("/updateConfigurationStatus/:id",updateConfigurationStatus);


adminRoute.get("/getRightBottomFrontendNews",getRightBottomFrontendNews);
adminRoute.get("/getRightBottomFrontendNews_onlyRight",getRightBottomFrontendNews_onlyRight);
adminRoute.get("/getRightBottomFrontendNews_onlyBottom",getRightBottomFrontendNews_onlyBottom);


//Image Upload Only
adminRoute.post("/imageUpload", imageUpload);
adminRoute.post("/videoUpload", videoUpload);
//====================================================
// ===================  =======================
//====================================================
adminRoute.get("/Dashboardinfo", Dashboardinfo);
adminRoute.post("/frontend_Mainnews_and_fixedorder_news", frontend_Mainnews_and_fixedorder_news);
//====================================================
adminRoute.post("/addadvertisement", addadvertisement);
adminRoute.get("/getAlladvertisement", getAlladvertisement);
adminRoute.get("/getadvertisementById/:id", getadvertisementById);
adminRoute.put("/updateadvertisementById/:id", updateadvertisementById);
adminRoute.put("/updateadvertisementStatusById/:id", updateadvertisementStatusById);

// Epaper
adminRoute.post("/addPaper", addPaper);//main editor
adminRoute.patch("/uploaddailypaperpages", uploaddailypaperpages);
adminRoute.delete("/deletemainedition/:id", deletemainedition);
adminRoute.patch("/deleteeditionsubpages/:id/:subid", deleteeditionsubpages);
adminRoute.get("/getepaperPages", getepaperPages);
adminRoute.get("/getSinglpaper/:id", getSinglpaper);

adminRoute.get("/getsearchdataresult/:word", getsearchdataresult);


// ==================E N D======================
module.exports = adminRoute;
