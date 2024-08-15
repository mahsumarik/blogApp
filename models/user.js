const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "you should enter name and surname",
        },
        isFullName(value) {
          if (value.split(" ").length < 2) {
            throw new Error("please enter informatin of name and surname");
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "You have already registered with the e-mail address you entered.",
      },
      validate: {
        notEmpty: {
          msg: "you should enter name and surname",
        },
        isEmail: {
          msg: "should be email format",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password cannot be empty",
           },
           len: {
                args: [5, 10],
                msg:"password length should be between 5 and 10"
           }
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

User.afterValidate( async (user) => {
     user.password= await bcrypt.hash(user.password, 10);
})

module.exports = User;
