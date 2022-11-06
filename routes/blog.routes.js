const express = require('express');
const passport = require('passport');
const blogController = require('../controllers/blog.controller');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs);

blogRouter.get('/blog/:id', blogController.getBlogByID);

blogRouter.get('/myblogs/', passport.authenticate("jwt", { session: false }), blogController.getMyBlogs);

blogRouter.post('/', passport.authenticate("jwt", { session: false }), blogController.addBlog);

blogRouter.put('/:id', passport.authenticate("jwt", { session: false }), blogController.updateBlogByID);

blogRouter.delete('/:id', passport.authenticate("jwt", { session: false }), blogController.deleteBlogByID);

module.exports = blogRouter