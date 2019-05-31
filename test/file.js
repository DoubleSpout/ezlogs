const logger = require('../index')([{
    type: 'file',
    path: './test/logs',
    // level: 'debug',
    level: 'trace',
    filename: 'file_test_log.log'
}])

console.time('a')
console.time('b')
for (var i = 0; i < 300000; i++) {
    logger.error(i)
}

console.timeEnd('a')
process.on('exit', ()=> console.timeEnd('b'))