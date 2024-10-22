const logger = require('./logger')
const morgan = require('morgan')

morgan.token('body', (request, _response) => {
    if (request.body) {
        let temp = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
        }
        return `request body: ${JSON.stringify(temp)}`
    } else {
        return '{}'
    }
})
const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

module.exports = {
    morgan,
    unknownEndPoint,
    errorHandler
}

