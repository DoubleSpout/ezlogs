const { date_format, DateFormat } = require('./date_format')

function Logger() {
    this.appenders = []
    process.on('exit', () => {
        for (let i = 0; i < this.appenders.length; i++) {
            this.appenders[i].close()
        }
    })
}

const _levelMap = {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
    FATAL: 6,
}

const df = new DateFormat()
Logger.prototype._output = function _output(_level, _str) {
    // const str = `${date_format()} [${_level.padEnd(5)}]`

    const str = `${df.toString()} [${_level.padEnd(5)}]`
    // const str = ''
    for (let i = 0; i < this.appenders.length; i++) {
        const current = this.appenders[i]
        current.level = current.level ? current.level.toUpperCase() : 'TRACE'
        if (_levelMap[_level] >= _levelMap[current.level]) {
            current.write(str, current.sep, _str)
        }
    }
}

Logger.prototype.trace = function trace() {
    this._output('TRACE', arguments)
}

Logger.prototype.debug = function debug() {
    this._output('DEBUG', arguments)
}

Logger.prototype.info = function info() {
    this._output('INFO', arguments)
}

Logger.prototype.log = Logger.prototype.info

Logger.prototype.warn = function warn() {
    this._output('WARN', arguments)
}

Logger.prototype.error = function error() {
    this._output('ERROR', arguments)
}
Logger.prototype.fatal = function fatal() {
    this._output('FATAL', arguments)
}

module.exports = Logger
