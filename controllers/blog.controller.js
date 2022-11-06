const blogModel = require('../models/blogs');
const { calcReadingTime } = require('../utils/utils')

function getAllBlogs(req, res, next) {
    console.log("all blogs");
}

function getBlogByID(req, res, next) {
    console.log("blog by id");
}

function getBlogsByUserID(req, res, next) {
    console.log("all blogs by userid");
}

function addBlog(req, res, next) {
    const user = req.user;
    const reading_time = calcReadingTime(req.body.body);
    const blog = {...req.body, author: user._id, reading_time};

    if (!blog.title || !blog.body) {
        return next(new Error("Title and body fields are required"))
    }

    blogModel.create(blog)
        .then((blog) => {
            res.status(201).send({
                message: "Blog post successfully created",
                data: { blog }
            });
        })
        .catch((err) => {
            next(err);
        })
}

function updateBlogByID(req, res, next) {
    console.log("blog updated");
}

function deleteBlogByID(req, res, next) {
    console.log("blog deleted");
}

module.exports = {
    getAllBlogs,
    getBlogByID,
    getBlogsByUserID,
    addBlog,
    updateBlogByID,
    deleteBlogByID
}