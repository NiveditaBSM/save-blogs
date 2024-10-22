const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')


mongoose.connect(config.MONGODB_URI).then(result =>
    logger.info('connected to mongoDB')
).catch(error =>
    logger.error('error connecting to mongoDB', error.message)
)

mongoose.set('strictQuery', false)

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
    app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :body'))
}

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app









