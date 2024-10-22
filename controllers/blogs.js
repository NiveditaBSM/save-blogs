const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.extractUser, async (request, response) => {
    const body = request.body

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id,
        likes: body.likes
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.extractUser, async (request, response) => {
    const blogId = request.params.id

    const user = request.user
    const blog = await Blog.findById(blogId)

    if (!user || !blog) {
        return response.status(404).json({ error: 'blog or user not found' })
    }

    if (!(user._id.equals(blog.user))) {
        response.status(401).json({ error: 'user unauthorized to delete note' })
        return
    }

    await Blog.findByIdAndDelete(blog._id)

    await User.updateMany(
        { blogs: blogId },
        { $pull: { blogs: blogId } }
    )

    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const { title, author, url, likes } = request.body

    Blog.findByIdAndUpdate(id, { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedBlog =>
            response.json(updatedBlog)
        ).catch(error => next(error))
})

module.exports = blogRouter