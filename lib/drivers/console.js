function ConsoleAppender(conf) {
    if (conf.type !== 'console') {
        throw new Error('')
    }
    this.sep = typeof conf.sep === 'string' ? conf.sep : '#'
    this.level = conf.level
}
ConsoleAppender.prototype.write = function write(prefix, sep, args) {
    // eslint-disable-next-line no-console
    console.log(prefix, sep, ...args)
}
ConsoleAppender.prototype.close = function close() {

}
module.exports = ConsoleAppender
