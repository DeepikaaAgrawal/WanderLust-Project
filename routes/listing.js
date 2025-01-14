const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.route("/signup")
  .get(userController.renderSignupForm)
  .post( wrapAsync(userController.signup));
  
  router.route("/login")
  .get(userController.renderLoginForm)
  .post(
      saveRedirectUrl,
      passport.authenticate("local",{
          failureRedirect:"/login",
          failureFlash:true,
      }),
      userController.login
  );
  
  router.get("/logout",userController.logout);

router.get("/search", wrapAsync(listingController.searchResult));
router
   .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
   
    upload.single('listing[image]'),
    validateListing,
      wrapAsync(listingController.createListing)
  );



 //New Route
 router.get("/new",isLoggedIn, listingController.renderNewForm);
  
  router
  .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, wrapAsync(listingController.updateListing))
    .delete(
      isLoggedIn,
      isOwner,
       wrapAsync(listingController.destroyListing));

 
  //Edit Route
  router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));
  

module.exports=router;
