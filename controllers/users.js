const User = require("../models/users")

module.exports.signupFormRender = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
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
};
module.exports.loginFormRender = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let redirect = res.locals.saveRedirect || "/listings";
    console.log("Redirecting to:", redirect);
    delete req.session.redirectUrl; // Clear the session variable after using it
    res.redirect(redirect);
};
module.exports.destroyUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};