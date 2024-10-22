const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

userRouter.post('/', async (request, response) => {
    body = request.body
    const saltRounds = 10

    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password: is expected to have at least 3 characters' })
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const userToAdd = new User({
        name: body.name,
        username: body.username,
        passwordHash: passwordHash
    })

    savedUser = await userToAdd.save()

    response.status(201)
    response.json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })

    response.json(users)
})

module.exports = userRouter
