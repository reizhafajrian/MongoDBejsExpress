const isLogin = (req, res, next) => {
    console.log(req.session.user)
    if (req.session.user === null || typeof req.session.user === "undefined") {
      res.redirect("/login");
    } else {
      next();
    }
};

module.exports = isLogin;
