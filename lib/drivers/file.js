const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const { Console } = require('console')
const util = require('util')

function FileAppender(conf) {
    this.sep = typeof conf.sep === 'string' ? conf.sep : '#'
    const base_path = path.normalize(conf.path)
    const { filename } = conf
    const full_path = path.join(base_path, filename)
    mkdirp.sync(base_path)
    this.stream = fs.createWriteStream(full_path, {
        flags: 'a',
        defaultEncoding: 'utf8',
    })
    this.level = conf.level
}
FileAppender.prototype.write = function write(prefix, sep, args) {
    this.stream.write(`${prefix} ${sep} ${util.format.apply(util, args)}`)
}
FileAppender.prototype.close = function close() {
    this.stream.close()
}

module.exports = FileAppender
