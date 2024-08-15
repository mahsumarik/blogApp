const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homepage: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  approval: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: true,
  validate: {
    checkValidApproval() {
      if (this.homepage && !this.approval) {
        throw new Error("You did not approve the blog you added to the homepage")
      }
    }
  }
});

module.exports = Blog;
