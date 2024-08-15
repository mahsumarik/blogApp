const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/blogs/category/:slug", userController.blogs_list);

router.get("/blogs/:slug", userController.blogs_details);

router.get("/blogs", userController.blogs_list);

router.get("/", userController.index);

module.exports = router;

// router.use("/blogs/category/:categoryid", async function (req, res) {
//   const id = req.params.categoryid
//   try {
//     const [blogs] = await db.execute("select * from blog where categoryid=?", [id]);
//     const [categories] = await db.execute("select * from category");
//     res.render("users/blogs", {
//       title: "Tüm Kurslar",
//       blogs: blogs,
//       categories: categories,
//       selectedCategory:id
//     });
//   }
//   catch (err) {
//     console.log(err)
//   }
// })

// router.use("/blogs/:blogid", async function (req, res) {
//   const id = req.params.blogid;
//   try {
//     const [blogs] = await db.execute("select * from blog where blogid=?", [id]);
//     const blog = blogs[0];
//     if (blog) {
//       return res.render("users/blog-details", {
//         title: blog,
//         blog: blog,
//       });
//     }
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.use("/blogs", async function (req, res) {
//   try {
//     const [blogs] = await db.execute("select * from blog where approval=1");
//     const [categories] = await db.execute("select * from category");
//     res.render("users/blogs", {
//       title: "Tüm Kurslar",
//       blogs: blogs,
//       categories: categories,
//       selectedCategory:null
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.use("/", async function (req, res) {
//   try {
//     const [blogs] = await db.execute(
//       "select * from blog where approval=1 and homepage=1"
//     );
//     const [categories] = await db.execute("select * from category");
//     res.render("users/index", {
//       title: "Popüler Kurslar",
//       blogs: blogs,
//       categories: categories,
//       selectedCategory:null
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });


