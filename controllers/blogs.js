const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    await Blog.findByIdAndDelete(id)
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