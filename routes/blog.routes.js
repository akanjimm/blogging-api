const express = require('express');
const passport = require('passport');
const blogController = require('../controllers/blog.controller');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs);

blogRouter.get('/:id', blogController.getBlogByID);

blogRouter.get('/myblogs/:userid', passport.authenticate("jwt", { session: false }), blogController.getBlogsByUserID);

blogRouter.post('/', passport.authenticate("jwt", { session: false }), blogController.addBlog);

blogRouter.put('/:id', passport.authenticate("jwt", { session: false }), blogController.updateBlogByID);

blogRouter.delete('/:id', passport.authenticate("jwt", { session: false }), blogController.deleteBlogByID);

module.exports = blogRouter