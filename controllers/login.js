const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordMatch = user === null ? false : bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
        response.send(401)
        response.json({ error: 'invalid username or password' })
    }

    const userForToken = {
        username: user.name,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

    response.json({ token, username: user.username, user: user.name })
})

module.exports = loginRouter