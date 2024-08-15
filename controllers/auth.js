const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");

exports.get_register = async function (req, res,next) {
  try {
    return res.render("auth/register", {
      title: "register",
    });
  } catch (err) {
    next(err);
  }
};

exports.post_register = async function (req, res,next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  //const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //const user = await User.findOne({ where: { email: email } });
    // database ile asagıdaki hata kontrolünü yapacagız
    // if (user) {
    //   req.session.message = {
    //     text: "You have already registered with the e-mail address you entered.",
    //     class: "warning",
    //   };
    //   return res.redirect("login");
    // };

    //throw new Error("error occur")
    const newUser = await User.create({
      fullName: name,
      email: email,
      password: password,
    });
    emailService.sendMail({
      from: config.email.from,
      to: newUser.email,
      subject: "account is created",
      text: "account is created successfully",
    });
    req.session.message = {
      text: "you can enter your account",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    let msg = "";
    if (err.name == "Sequelize Validation Error" || err.name == "SequelizeUniqueConstraintError") {
      for (let e of err.errors) {
        msg += e.message + ". ";
      }
      return res.render("auth/register", {
        title: "register",
        message: { text: msg, class: "danger" },
      });
    } else {
      // msg += "An unknown error occurred, please try again."
      // console.log(err);
      // res.redirect("/500");
      next(err);
    }
  }
};

exports.get_login = async function (req, res,next) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "login",
      message: message,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.post_login = async function (req, res,next) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.render("auth/login", {
        title: "login",
        message: { text: "email is wrong", class: "danger" },
      });
    }
    // check parola
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      //req-res
      //****************************************************** */
      //cookie
      //res.cookie("isAuth", 1);
      //****************************************************** */
      //session
      const userRoles = await user.getRoles({
        attributes: ["roleName"],
        raw: true,
      });
      req.session.roles = userRoles.map((role) => role["roleName"]);
      req.session.isAuth = true;
      req.session.fullName = user.fullName;
      req.session.userid = user.id;
      const url = req.query.returnUrl || "/";
      return res.redirect(url);
    }

    return res.render("auth/login", {
      title: "login",
      message: { text: "password is wrong", class: "danger" },
    });
  } catch (err) {
    next(err);
  }
};

exports.get_logout = async function (req, res,next) {
  try {
    await req.session.destroy();
    return res.redirect("/account/login");
  } catch (err) {
    next(err);
  }
};

exports.get_reset = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/reset-password", {
      title: "reset password",
      message: message,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_reset = async function (req, res) {
  const email = req.body.email;
  try {
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.session.message = { text: "Email cannot found", class: "danger" };
      return res.redirect("reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    emailService.sendMail({
      from: config.email.from,
      to: email,
      subject: "Reset password",
      html: `
                <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                <p>
                    <a href="http://127.0.0.1:3000/account/new-password/${token}">Reset Password<a/>
                </p>
            `,
    });

    req.session.message = {
      text: "check the email address to reset passowrd",
      class: "success",
    };
    res.redirect("login");
    return res.render("auth/register", {
      title: "register",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_newPassword = async function (req, res) {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    return res.render("auth/new-password", {
      title: "new password",
      message: message,
      token: token,
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_newPassword = async function (req, res) {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
        id: userId,
      },
    });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.session.message = { text: "password is updated", class: "success" };
    return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};
