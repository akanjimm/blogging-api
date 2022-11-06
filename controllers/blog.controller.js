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
    const blog = { ...req.body, author: user._id, reading_time };

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
    const blogId = req.params.id;
    let blogUpdate = req.body;
    const loggedInUser = req.user;

    // Prevent manual updating of author, read_count and reading_time
    if (blogUpdate.author || blogUpdate.read_count || blogUpdate.reading_time) {
        return next(new Error("Sorry, you can't update author, read count and reading time"));
    }

    blogModel.findOne({ _id: blogId })
        .then(async (blog) => {
            // check if blog owner is the current loggedin user
            if (loggedInUser._id !== blog.author.toString()) {
                return next(new Error("Sorry, you are not the blog owner. You can't update blog."))
            }

            // update blog
            try {
                blogUpdate.updatedAt = new Date();
                const updatedBlog = await blogModel.findByIdAndUpdate(blogId, blogUpdate, { new: true });
                res.status(200).send({
                    message: "Blog post successfully updated",
                    data: { updatedBlog }
                });
            } catch (err) {
                next(err);
            }
        })
        .catch((err) => {
            next(err);
        })
}

function deleteBlogByID(req, res, next) {
    const blogId = req.params.id;
    const loggedInUser = req.user;

    blogModel.findOne({ _id: blogId })
        .then(async (blog) => {
            // check if blog owner is the current loggedin user
            if (loggedInUser._id !== blog.author.toString()) {
                return next(new Error("Sorry, you are not the blog owner. You can't update blog."))
            }

            // delete blog
            try {
                const updatedBlog = await blogModel.findByIdAndDelete(blogId);
                res.status(200).send({
                    message: "Blog post successfully deleted",
                    data: {}
                });
            } catch (err) {
                next(err);
            }
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = {
    getAllBlogs,
    getBlogByID,
    getBlogsByUserID,
    addBlog,
    updateBlogByID,
    deleteBlogByID
}