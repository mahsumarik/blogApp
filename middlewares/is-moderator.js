module.exports = (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect("/account/login?returnUrl=" + req.originalUrl); // => /admin/blogs
  }

  if (
    !req.session.roles.includes("admin") &&
    !req.session.roles.includes("moderator")
  ) {
    req.session.message = { text: "Log in as an authorized user" };
    return res.redirect("/account/login?returnUrl=" + req.originalUrl);
  }
  next();
};
