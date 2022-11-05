const express = require('express');
const blogController = require('../controllers/blog.controller');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs);

blogRouter.get('/:id', blogController.getBlogByID);

blogRouter.get('/myblogs/:userid', blogController.getBlogsByUserID);

blogRouter.post('/', blogController.addBlog);

blogRouter.put('/:id', blogController.updateBlogByID);

blogRouter.delete('/:id', blogController.deleteBlogByID);

module.exports = blogRouter