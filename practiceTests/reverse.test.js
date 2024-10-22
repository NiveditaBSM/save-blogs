const { test, describe } = require('node:test')
const assert = require('node:assert')

const reverse = require('../../utils/for_test').reverse

describe('reverse- ', () => {
    test('reverse of a', () => {
        const result = reverse('a')

        assert.strictEqual(result, 'a')
    })

    test('reverse of node', () => {
        const result = reverse('node')
        assert.strictEqual(result, 'edon')
    })

    test('reverse of homemoh', () => {
        const result = reverse('homemoh')
        assert.strictEqual(result, 'homemoh')
    })
})
