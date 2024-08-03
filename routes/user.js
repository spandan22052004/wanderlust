const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
        let{username,email,password} = req.body;
        let newUser = new User({email,username});
        const registereduser = await User.register(newUser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {failureRedirect : '/login',
    failureFlash:true}),
    async(req,res)=>{
     req.flash("success","Welcome back to wanderlust!");
     let redirect = res.locals.saveRedirect || "/listings";
     res.redirect(redirect);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
});


module.exports = router;