const isLogin = (req, res, next) => {

    if (req.session.user === null || typeof req.session.user === "undefined") {
      res.setHeader("Content-Type", "text/html");
      res.redirect("/login");
    } else {
      next();
    }
};

module.exports = isLogin;
