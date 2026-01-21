const User = require("../models/user.js")
module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.register = async(req,res)=>{
try{
    let {username, email,password} = req.body;
    let newUser = User({
        username,email
    })
  let registeredUser =  await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
      req.flash("success","Welcome to wanderlust")
  res.redirect("/listings");
  });
}catch(e){
    req.flash("error",e.message)
    res.redirect("/signup")
}
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginAuthenticate = async(req,res)=>{
req.flash("success","Welcome back to Our Website");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successfully")
        res.redirect("/listings")
    });
}