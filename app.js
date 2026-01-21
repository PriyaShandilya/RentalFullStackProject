if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}
// console.log(process.env.SECERET)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listingRoutes.js")
const Listing = require("./models/listing.js");
const reviewRouter = require("./routes/reviewRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.engine("ejs",engine);
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views","views");
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
const { createWebCryptoAdapter } = require('connect-mongo');



const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl)
}
main().then(()=>{
    console.log("Database connected Successfully");
}).catch((err)=>{
    console.log(err);
})

const store = MongoStore.create({
  mongoUrl: dbUrl,
  cryptoAdapter: createWebCryptoAdapter({
    secret: process.env.SECRET,
  }),
touchAfter: 24 * 3600,
})
store.on("error",(err)=>{
    console.log("Error in Mongo session store",err);
});

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+365*24*60*60*1000,
        maxAge:365*24*60*60*1000+4,
        httpOnly:true
    },
}


app.use(session(sessionOption)) 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
 res.locals.sucMsg= req.flash("success");
 res.locals.errMsg = req.flash("error");
 res.locals.currUser = req.user;
 next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/listing",async(req,res)=>{
let place = req.query.location;
if(!place || place.trim()===""){
    return res.send("did not match any results");
}else{
    
    let AllListing =  await Listing.find({location:{$regex:place,$options:"i"}
});

    res.render("listings/search.ejs",{AllListing})
}

});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { status = 500 } = err;
    // If it's a Mongoose validation error, you can simplify the message
    let message = err.message; 
    if (err.name === "ValidationError") {
        message = "Please fill out all fields correctly before submitting.";
    }
    res.status(status).render("listings/error.ejs", { message });
});

app.listen(port,()=>{
    console.log(`Server is listening on ${port}.`);
})
