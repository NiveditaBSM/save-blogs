const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

describe('testing the blog app for- ', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogsPromiseArray = helper.initialBlogs.map(async (blog) => {
            const newBlog = new Blog(blog)
            return newBlog.save()
        })

        await Promise.all(blogsPromiseArray)
    })

    test('blog list api returns list in JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(helper.initialBlogs.length, response.body.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')

        const blog = response.body[0]
        assert((blog.hasOwnProperty('id') && !blog.hasOwnProperty('_id')))
    })

    test('new blog is created successfully', async () => {
        const initialBlogs = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(helper.singleBlog)
            .expect(201)

        const currentBlogs = await helper.blogsInDb()
        const blogTitles = currentBlogs.map(blog => blog.title)

        assert.strictEqual(initialBlogs.length + 1, currentBlogs.length)
        assert(blogTitles.includes(helper.singleBlog.title))

    })

    test('when no likes provided while creating, defaults to 10', async () => {
        const response = await api
            .post('/api/blogs')
            .send(helper.blogWithoutLikes)

        const savedBlog = response.body
        assert.strictEqual(savedBlog.likes, 10)
    })

    test('new blog will not be saved if title is missing', async () => {
        await api
            .post('/api/blogs')
            .send(helper.blogWithoutTitle)
            .expect(400)
    })

    test('new blog will not be saved if url is missing', async () => {
        await api
            .post('/api/blogs')
            .send(helper.blogWithoutUrl)
            .expect(400)
    })

    test('particular blog can be deleted given blog id', async () => {
        response = await api
            .post('/api/blogs')
            .send(helper.tempBlog)

        const savedBlog = response.body
        const beforeDelete = await helper.blogsInDb()

        await api
            .delete(`/api/blogs/${savedBlog.id}`)
            .expect(204)

        const afterDelete = await helper.blogsInDb()

        assert.strictEqual(afterDelete.length, beforeDelete.length - 1)
    })

    test('particular blog can be updated given blog id with author, url, title, likes', async () => {
        const blogs = await helper.blogsInDb()

        const blogToUpdate = blogs[0]

        blogToUpdate.likes = 999

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        assert.strictEqual(updatedBlog.body.likes, 999)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})