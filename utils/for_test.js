const reverse = (string) => {
    return string
        .split('')
        .reverse()
        .join('')
}

const average = (array) => {
    return array.length === 0 ? 0 : array.reduce((sum, item) => sum + item, 0) / array.length
}

module.exports = {
    reverse,
    average
}