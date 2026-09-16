const User = require("../models/user.js");

//Show signup form
module.exports.renderSignupForm = (req, res) => {
  // Check if they are already logged in
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in!");
    return res.redirect("/listings");
  }
  res.render("users/signup.ejs");
}

//signUp
module.exports.signUp = async (req, res, next) => {
    try {
      let { username, password, email } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        req.session.save(() => {
            res.redirect("/listings");
        });
      })
    } catch (e) {
      console.log("SIGNUP ERROR IS:", e.message); 
      req.flash("error", e.message);
      req.session.save(() => {
          res.redirect("/signup");
      });
    }
}

// Show login form
module.exports.renderLoginForm = (req, res) => {
  // Check if they are already logged in
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in!");
    return res.redirect("/listings");
  }
  res.render("users/login.ejs");
}

//login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // Force session to save before redirecting!
    req.session.save(() => {
        res.redirect(redirectUrl);
    });
}

//logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if ( err ){
      return next(err);
    }
    req.flash("error", "you are logged out!");
    res.redirect("/listings");
  })
}