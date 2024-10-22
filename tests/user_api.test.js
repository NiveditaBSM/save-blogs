const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('./userTest_helper')
const api = supertest(app)

describe('when initially there is only one user in the database', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passHash = await bcrypt.hash('secret', 10)
        const newUser = new User({
            username: 'root',
            passwordHash: passHash
        })

        await newUser.save()
    })

    describe('adding new users', () => {
        test('successfully adding user with fresh username', async () => {

            const usersAtStart = await helper.usersInDb()

            const newUser = {
                name: 'Nivedita',
                username: 'Ivin',
                password: 'ivinpass'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            const usernames = usersAtEnd.map(user => user.username)

            assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
            assert(usernames.includes(newUser.username))
        })

        test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'pass',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert(result.body.error.includes('expected username to be unique'))

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('creation fails with proper statuscode and message if username has less than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'ro',
                name: 'Superuser',
                password: 'pass',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert(result.body.error.includes('username: is expected to have at least 3 characters'))

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('creation fails with proper statuscode and message if password has less than 3 characters', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'random',
                name: 'Superuser',
                password: 'pa',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert(result.body.error.includes('password: is expected to have at least 3 characters'))

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })


    })

    after(async () => {
        await mongoose.connection.close()
    })
})
