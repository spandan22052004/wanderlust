if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET) ;


const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const session = require("express-session")
const  flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const LocalStrategy  = require("passport-local");
//--------------------------------------------------------//
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(() => {
    console.log("Connected with DB");
}).catch((err) => {
    console.error("Error connecting to database:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret : "mysupersecretcode",
    resave:false,
    saveUninitialized :true,
    cookie :{
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly :true,
    }
}


//Root route.....(0)
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});  


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
//  const fakeUser = new User({
//     email : "deltastudent123@gmail.com",
//     username :"delta-student"
//  });
//  let registerdUser = await User.register(fakeUser,"helloworld");
//  res.send(registerdUser);
// })
app.use("/listings",searchRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not found"));
})


app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
