const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const adminController = require("../controllers/admin");
const isAdmin = require("../middlewares/is-admin");
const csrf = require("../middlewares/csrf");
const isModerator = require("../middlewares/is-moderator");


router.get("/blog/delete/:blogid", isAdmin, isModerator, csrf, adminController.get_blog_delete);

router.post("/blog/delete/:blogid", isAdmin, isModerator, adminController.post_blog_delete);

router.get("/blog/create", isAdmin, isModerator, csrf, adminController.get_blog_create);

router.post("/blog/create", csrf, isModerator, imageUpload.upload.single("image"), adminController.post_blog_create);

router.get("/blogs/:blogid", isAdmin,isModerator,  csrf, adminController.get_blog_edit);

router.post("/blogs/:blogid", isAdmin, isModerator, imageUpload.upload.single("image"), adminController.post_blog_edit);

router.get("/blogs", isAdmin, isModerator, adminController.get_blogs);


router.get("/categories", isAdmin,  adminController.get_categories);

router.get("/category/create", isAdmin, csrf, adminController.get_category_create);

router.post("/categories/remove", isAdmin, adminController.get_category_remove);

router.post("/category/create", isAdmin, adminController.post_category_create);

router.get("/categories/:categoryid", isAdmin, csrf, adminController.get_category_edit);

router.post("/categories/:categoryid", isAdmin, adminController.post_category_edit);

router.get("/category/delete/:categoryid", isAdmin, csrf, adminController.get_category_delete);

router.post("/category/delete/:categoryid", isAdmin, adminController.post_category_delete);


router.get("/roles", isAdmin, adminController.get_roles);
router.get("/roles/:roleid", isAdmin, csrf, adminController.get_role_edit);
router.post("/roles/remove", isAdmin, adminController.roles_remove);
router.post("/roles/:roleid", isAdmin, csrf, adminController.post_role_edit);


router.get("/users", isAdmin, adminController.get_user);
router.get("/users/:userid", isAdmin, csrf, adminController.get_user_edit);
router.post("/users/:userid", isAdmin, adminController.post_user_edit);

module.exports = router;
