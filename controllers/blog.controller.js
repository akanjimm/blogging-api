const blogModel = require('../models/blogs');

function getAllBlogs(req, res) {
    console.log("all blogs");
}

function getBlogByID(req, res) {
    console.log("blog by id");
}

function getBlogsByUserID(req, res) {
    console.log("all blogs by userid");
}

function addBlog(req, res) {
    console.log("add blog");
}

function updateBlogByID(req, res) {
    console.log("blog updated");
}

function deleteBlogByID(req, res) {
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