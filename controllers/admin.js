//const db = require("../data/db");
const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const { Op } = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slugfield");

exports.get_blog_delete = async function (req, res) {
  const blogid = req.params.blogid;
  const userid = req.session.userid;
  const isAdmin = req.session.roles.includes("admin");
  try {
    // const [blogs,] = await db.execute("select * from blog where blogid=?", [blogid]);
    // const blog = blogs[0];
    const blog = await Blog.findOne({
      where: isAdmin ? {id: blogid} :{ id: blogid, userId: userid }
    });
    if (blog) {
      return res.render("admin/blog-delete", {
        title: "delete blog",
        blog: blog,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.post_blog_delete = async function (req, res) {
  const blogid = req.body.blogid;
  try {
    // await db.execute("delete from blog where blogid=?", [blogid]);
    const blog = await Blog.findByPk(blogid);
    if (blog) {
      await blog.destroy();
      return res.redirect("/admin/blogs?action=delete");
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};

exports.get_category_delete = async function (req, res) {
  const categoryid = req.params.categoryid;
  try {
    // const [categories,] = await db.execute("select * from category where categoryid=?", [categoryid]);
    // const category = categories[0];
    const category = await Category.findByPk(categoryid);
    res.render("admin/category-delete", {
      title: "delete category",
      category: category,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_category_delete = async function (req, res) {
  const categoryid = req.body.categoryid;
  try {
    // await db.execute("delete from category where categoryid=?", [categoryid]);
    await Category.destroy({
      where: {
        id: categoryid,
      },
    });
    res.redirect("/admin/categories?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.get_blog_create = async function (req, res) {
  try {
    //const [categories] = await db.execute("select * from category");
    const categories = await Category.findAll();

    res.render("admin/blog-create", {
      title: "add blog",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_blog_create = async function (req, res) {
  const title = req.body.title;
  const subtitle = req.body.subtitle;
  const description = req.body.description;
  //const image = req.file.filename;
  const homepage = req.body.homepage === "on" ? 1 : 0;
  const approval = req.body.approval === "on" ? 1 : 0;
  const userid = req.session.userid;
  let image = "";
  try {
    // await db.execute(
    //   "INSERT INTO blog(title,subtitle,description,image,homepage,approval,categoryid) VALUES (?,?,?,?,?,?,?)",
    //   [title,subtitle, description, image, homepage, approval, categoryid]
    // );

    if (title == "") {
      throw new Error("Title cannot be empty");
    };

    if (title.length < 5 || title.length > 20) {
      throw new Error("interval of title length should be in range 5-20")
    };

    if(description == "") {
      throw new Error("description cannot be empty");
    };

    if (req.file) {
      image = req.file.filename;
      fs.unlink("./public/images/" + req.body.image, err => {
        console.log(err);
      })
    }
    await Blog.create({
      title: title,
      url: slugField(title),
      subtitle: subtitle,
      description: description,
      image: image,
      homepage: homepage,
      approval: approval,
      userId:userid
    });
    res.redirect("/admin/blogs?action=create");
  } catch (err) {
    let errorMessages = "";
    if (err instanceof Error) {
      errorMessages += err.message;
      res.render("admin/blog-create", {
        title: "add blog",
        categories: await Category.findAll(),
        message: { text: errorMessages, class: "danger" },
        values: {
          title: title,
          subtitle: subtitle,
          description:description
        }
      })
    }
  }
};

exports.get_category_create = async function (req, res) {
  try {
    res.render("admin/category-create", {
      title: "add category",
    });
  } catch (err) {
    res.redirect("/500");
  }
};

exports.post_category_create = async function (req, res) {
  const name = req.body.name;
  try {
    //await db.execute("INSERT INTO category(name) VALUES (?)",[name]);
    await Category.create({ name: name });
    res.redirect("/admin/categories?action=create");
  } catch (err) {
    console.log(err);
  }
};

exports.get_blog_edit = async function (req, res) {
  const blogid = req.params.blogid;
  const userid = req.session.userid;
  const isAdmin = req.session.roles.includes("admin");
  try {
    //const [blogs] = await db.execute("select * from blog where blogid=?", [blogid,]);
    const blog = await Blog.findOne({
      where: isAdmin ? {id:blogid}: { id: blogid, userId:userid},
      include: {
        model: Category,
        attributes: ["id"],
      },
    });
    const categories = await Category.findAll();
    //const [categories] = await db.execute("select * from category");
    // const blog = blogs[0];
    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.dataValues.title,
        blog: blog.dataValues,
        categories: categories,
      });
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};

exports.post_blog_edit = async function (req, res) {
  const blogid = req.body.blogid;
  const title = req.body.title;
  const subtitle = req.body.subtitle;
  const description = req.body.description;
  const categoryIds = req.body.categories;
  const url = req.body.url;
  const userid = req.session.userid;
  //console.log(categoryIds);
  let image = req.body.image;
  if (req.file) {
    image = req.file.filename;
    fs.unlink("./public/images/" + req.body.image, (err) => {
      console.log(err);
    });
  }
  const homepage = req.body.homepage === "on" ? 1 : 0;
  const approval = req.body.approval === "on" ? 1 : 0;
  const isAdmin = req.session.roles.includes("admin");
  try {
    // await db.execute(
    //   "UPDATE blog SET title=?, subtitle=?, description=?, image=?, homepage=?, approval=?, categoryid=? WHERE blogid=?",
    //   [title, subtitle, description, image, homepage, approval, categoryid, blogid]
    // );
    
    const blog = await Blog.findOne({
      where: isAdmin ? {id:blogid}: { id: blogid, userId:userid},
      include: {
        model: Category,
        attributes: ["id"],
      },
    });
    if (blog) {
      blog.title = title;
      blog.subtitle = subtitle;
      blog.description = description;
      blog.image = image;
      blog.homepage = homepage;
      blog.approval = approval;
      blog.url = url;

      if (categoryIds == undefined) {
        await blog.removeCategories(blog.categories);
      } else {
        await blog.removeCategories(blog.categories);
        const selectedCategories = await Category.findAll({
          where: {
            id: {
              [Op.in]: categoryIds,
            },
          },
        });
        await blog.addCategories(selectedCategories);
      }

      await blog.save();
      return res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};

exports.get_category_remove = async function (req, res) {
  const blogid = req.body.blogid;
  const categoryid = req.body.categoryid;

  await sequelize.query(
    `delete from blogCategories where blogId=${blogid} and categoryId=${categoryid}`
  );
  res.redirect("/admin/categories/" + categoryid);
};

exports.get_category_edit = async function (req, res) {
  const categoryid = req.params.categoryid;
  try {
    //const [categories,] = await db.execute("select * from category where categoryid=?", [categoryid]);
    // const category = await Category.findAll({
    //   where: {
    //     categoryid: categoryid
    //   }
    // });
    // console.log(category);
    const category = await Category.findByPk(categoryid);
    const blogs = await category.getBlogs();
    const countBlog = await category.countBlogs();
    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues,
        blogs: blogs,
        countBlog: countBlog,
      });
    }
    res.redirect("admin/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.post_category_edit = async function (req, res) {
  const categoryid = req.body.categoryid;
  const name = req.body.name;

  try {
    const category = await Category.findByPk(categoryid);
    if (category) {
      category.name = name;
      await category.save();

      // bu da bir seçenek update için
      // await Category.update({ name: name }, {
      //   where: {
      //     categoryid: categoryid
      //   }
      // });

      return res.redirect(
        "/admin/categories?action=edit&categoryid=" + categoryid
      );
    }
    res.redirect("/admin/categories");
    // await db.execute(
    //   "UPDATE category SET name=? WHERE categoryid=?",[name,categoryid]);
  } catch (err) {
    console.log(err);
  }
};

exports.get_blogs = async function (req, res) {
  const userid = req.session.userid;
  const isModerator = req.session.roles.includes("moderator");
  const isAdmin = req.session.roles.includes("admin");
  try {
    //const [blogs] = await db.execute("select blogid,title,subtitle,image from blog");
    const blogs = await Blog.findAll({
      attributes: ["id", "title", "subtitle", "image"],
      include: {
        model: Category,
        attributes: ["name"],
      },
      where: isModerator && !isAdmin ? {userId:userid} : null
    });
    res.render("admin/blog-list", {
      title: "blog-list",
      blogs: blogs,
      action: req.query.action,
      blogid: req.query.blogid,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_categories = async function (req, res) {
  try {
    //const [categories] = await db.execute("select * from category");
    const categories = await Category.findAll();
    //console.log(categories)
    res.render("admin/category-list", {
      title: "blog-list",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_roles = async function (req, res) {
  try {
    const roles = await Role.findAll({
      attributes: {
        include: [
          "role.id",
          "role.roleName",
          [sequelize.fn("COUNT", sequelize.col("users.id")), "user_count"],
        ],
      },
      include: [{ model: User, attributes: ["id"] }],
      group: ["role.id"],
      raw: true,
      includeIgnoreAttributes: false,
    });
    res.render("admin/role-list", {
      title: "role-list",
      roles: roles,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_role_edit = async function (req, res) {
  const roleid = req.params.roleid;
  try {
    const role = await Role.findByPk(roleid);
    const users = await role.getUsers();
    if (role) {
      return res.render("admin/role-edit", {
        title: role.rolename,
        role: role,
        users: users,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.post_role_edit = async function (req, res) {
  const roleid = req.body.roleid;
  const rolename = req.body.roleName;
  try {
    await Role.update(
      { roleName: rolename },
      {
        where: {
          id: roleid,
        },
      }
    );
    return res.redirect("/admin/roles");
  } catch (err) {
    console.log(err);
  }
};

exports.roles_remove = async function (req, res) {
  const roleid = req.body.roleid;
  const userid = req.body.userid;
  try {
    await sequelize.query(
      `delete from userroles where userId=${userid} and roleId=${roleid}`
    );
    return res.redirect("/admin/roles/" + roleid);
  } catch (err) {
    console.log(err);
  }
};

exports.get_user = async function (req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullName", "email"],
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });
    res.render("admin/user-list", {
      title: "user list",
      users: users,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_user_edit = async function (req, res) {
  const userid = req.params.userid;
  try {
    const user = await User.findOne({
      where: { id: userid },
      include: { model: Role, attributes: ["id"] },
    });
    const roles = await Role.findAll();

    res.render("admin/user-edit", {
      title: "user edit",
      user: user,
      roles: roles,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_user_edit = async function(req,res) {
  const userid = req.body.userid;
  const fullName = req.body.fullName
  const email = req.body.email;
  const roleIds = req.body.roles;

  try {
      const user = await User.findOne({
          where: { id :userid },  
          include: { model: Role, attributes: ["id"] }
      });

      if(user) {
          user.fullName = fullName;
          user.email = email;

          if(roleIds == undefined) {
              await user.removeRoles(user.roles);
          }
          else {
              await user.removeRoles(user.roles);
              const selectedRoles = await Role.findAll({
                  where: {
                      id: {
                          [Op.in]: roleIds
                      }
                  }
              });
              await user.addRoles(selectedRoles);
          }

          await user.save();
          return res.redirect("/admin/users");
      }
      return res.redirect("/admin/users");
   }
   catch(err) {
       console.log(err);
   }
}