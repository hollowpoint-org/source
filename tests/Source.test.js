const Source = require('../lib/source.js')

test('list all files in source-dev-fuse S3 bucket', () => {
    expect(Source.execTask([
        'list source-dev-fuse',
        'aws s3 ls s3://source-dev-fuse --recursive --human-readable --summarize'
    ]))
    .toMatch(/Total Objects: /)
})

test('describe contents of ECS service at revision 1', () => {
    expect(Source.execTask([
        'describe service 1',
        'aws ecs describe-task-definition --task-definition service:1'
    ]))
    .toMatch(/"revision": 1/)
})

// test('generates a random string', () => {
//     expect(source.randomString(1, 'a')).toBe('a')
// })

// test('generates a cryptorandom string with length of 30', () => {
//     expect(cryptoRandomString(30)).toHaveLength(30)
// })

// test('test encryption and decryption', () => {
//     const encrypted = source.encrypt('This is a test.', 'password123')
//     expect(source.decrypt(encrypted, 'password123')).toBe('This is a test.')
// })

// test('get random value from array', () => {
//     const array = [1, 2, 3, 4, 5]
//     expect(randomValueFromArray(array).to)
// })

// test('get a deterministic value from an array', () => {
//     const array = [1, 2, 3, 4]
//     source.seededValueFromArray(array, '0Y')
// })

// test('wait .25 seconds', async () => {
//     await source.delay(250)
//     expect.anything()
// })

// test('filter output characters', () => {
//     expect(source.outputFilter('🍆')).toBe(false)
// })

// test('shuffle an array', () => {
//     let array = ['a', 'b', 'c', 'd', 'e']
//     source.shuffleArray(array)
//     expect(array).not.toBe(['a', 'b', 'c', 'd', 'e'])
// })

// test('remove the first word of a sentence', () => {
//     let phrase = 'the quick brown fox'
//     expect(source.removeFirst(phrase)).toBe('quick brown fox')
// })

// test('hash a string', () => {
//     expect(source.hashValue('test', {size: 64}, true)).toBe('00f9e6e6ef197c2b25')
// })