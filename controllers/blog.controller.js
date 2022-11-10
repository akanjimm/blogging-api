const blogModel = require('../models/blogs');
const userModel = require('../models/users');
const { calcReadingTime } = require('../utils/utils')

function getAllBlogs(req, res, next) {
    const sortOrderObject = {
        asc: 1,
        desc: -1
    }

    const author = req.query.author;
    const title = req.query.title;
    const tags = req.query.tags;
    const sortBy = req.query.sortBy;
    const sortOrder = sortOrderObject[req.query.sortOrder] || 1;
    let page = parseInt(req.query.page) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 20;

    const searchQuery = { state: "published" };
    const sortQuery = {};

    // set page to 1 if page query parameter is less than one
    if (page < 1) {
        page = 1;
    }

    if (pageLimit < 1) {
        pageLimit = 20;
    }
    let documentsToSkip = (page - 1) * pageLimit;

    // Check if query parameters are passed a value and assign search and sort objects values respectively
    if (author) searchQuery.author = author;
    if (title) searchQuery.title = new RegExp(title, "i");
    if (tags) searchQuery.tags = { $all: tags.split(" ") };
    if (["read_count", "reading_time", "timestamp"].includes(sortBy)) sortQuery[sortBy] = sortOrder;

    blogModel.find({ ...searchQuery })
        .sort({ ...sortQuery })
        .skip(documentsToSkip)
        .limit(pageLimit)
        .then((blogs) => {
            res.status(200).send({
                message: "All published blogs",
                data: { blogs }
            });
        })
        .catch((err) => {
            next(err);
        })
}

function getBlogByID(req, res, next) {
    const blogId = req.params.id;
    let author;

    blogModel.findOne({ _id: blogId, state: "published" })
        .then(async (blog) => {
            if (!blog) {
                res.status(404).send({
                    message: "Blog not found or blog is not published",
                    data: { blog }
                })
            };

            // Update blog's read_count
            try {
                let updatedCountBlog = await blogModel.findByIdAndUpdate(blogId, { read_count: blog.read_count + 1 }, { new: true });
                console.log(updatedCountBlog);
            } catch (error) {
                next(err);
            }

            // Get blog's author object
            try {
                author = await userModel.findOne({ _id: blog.author });
                author.password = undefined;
            } catch (error) {
                next(err);
            }

            res.status(200).send({
                message: "Blog found",
                data: { blog, author }
            })
        })
        .catch((err) => {
            next(err);
        })
}

function getMyBlogs(req, res, next) {
    const loggedInUser = req.user;
    const state = req.query.state;
    let page = parseInt(req.query.page) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 20;
    const filterQuery = {};

    // set page to 1 if page query parameter is less than one
    if (page < 1) {
        page = 1;
    }

    if (pageLimit < 1) {
        pageLimit = 20;
    }
    
    let documentsToSkip = (page - 1) * pageLimit;

    // Check if state query parameter is passed a value and assign value to the filter object
    if (state) filterQuery.state = state;

    blogModel.find({ author: loggedInUser._id, ...filterQuery })
        .skip(documentsToSkip)
        .limit(pageLimit)
        .then((blogs) => {
            res.status(200).send({
                message: "My blogs",
                data: { blogs }
            });
        })
        .catch((err) => {
            next(err);
        })
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

    // update blog reading time if blog body is updated
    if (blogUpdate.body) {
        blogUpdate.reading_time = calcReadingTime(blogUpdate.body);
    }

    console.log(blogUpdate);

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
    getMyBlogs,
    addBlog,
    updateBlogByID,
    deleteBlogByID
}