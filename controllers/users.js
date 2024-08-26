const User = require("../models/users")
const Listing = require("../models/listings");
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
//Wishlist
module.exports.showWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.render("./users/wishlist.ejs", { wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.redirect('/listings');
    }
};


module.exports.Addwishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const listing = await Listing.findById(req.params.listingId);

        if (user && listing) {
            // Check if the listing is already in the wishlist
            if (!user.wishlist.includes(listing._id)) {
                user.wishlist.push(listing._id);
                await user.save();
                res.status(200).json({ message: "Listing added to wishlist" });
            } else {
                res.status(400).json({ message: "Listing is already in wishlist" });
            }
        } else {
            res.status(404).json({ message: "User or Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports.destroyWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const listing = await Listing.findById(req.params.listingId);

        if (user && listing) {
            user.wishlist = user.wishlist.filter(
                (id) => id.toString() !== req.params.listingId
            );
            await user.save();
            // Redirect to the wishlist page
            res.redirect(`/wishlist/${req.user._id}`);
        } else {
            res.status(404).json({ message: "User or Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
