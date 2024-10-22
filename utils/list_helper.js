const logger = require('./logger')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        // logger.info('total and likes', total, blog.likes)
        return total + blog.likes
    }, 0)
}

const favoritaBlog = (blogs) => {
    const temp = blogs.map((blog) => blog.likes)
    const mostLikes = Math.max(...temp)
    logger.info(mostLikes)

    const blog = blogs.find((blog) => blog.likes === mostLikes)

    return { title: blog.title, author: blog.author, likes: blog.likes }
}

const mostBlogs = (blogs) => {
    let map = new Map()

    blogs.forEach((blog) => {
        if (map.has(blog.author)) {
            map.set(blog.author, map.get(blog.author) + 1)
        } else {
            map.set(blog.author, 1)
        }
    })

    //required author with maximum blog
    let tempAuthor = null
    let tempBlogNos = 0

    for (let [key, value] of map) {
        if (value > tempBlogNos) {
            tempAuthor = key
            tempBlogNos = value
        }
    }

    return {
        author: tempAuthor,
        blogs: tempBlogNos
    }
}

const mostLikes = (blogs) => {
    let map = new Map()

    blogs.forEach((blog) => {
        if (map.has(blog.author)) {
            map.set(blog.author, map.get(blog.author) + blog.likes)
        } else {
            map.set(blog.author, blog.likes)
        }
    })

    //required author with blogs with max accumulated likes
    let tempAuthor = null
    let tempLikeNos = 0

    for (let [key, value] of map) {
        if (value > tempLikeNos) {
            tempAuthor = key
            tempLikeNos = value
        }
    }

    return {
        author: tempAuthor,
        likes: tempLikeNos
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoritaBlog,
    mostBlogs,
    mostLikes
}