if (!String.prototype.padStart) {
    // eslint-disable-next-line no-extend-native
    String.prototype.padStart = function padStart(targetLength, padString = ' ') {
        return padString.repeat(targetLength - this.length) + this
    }
}

if (!String.prototype.padEnd) {
    // eslint-disable-next-line no-extend-native
    String.prototype.padEnd = function padEnd(targetLength, padString = ' ') {
        return this + padString.repeat(targetLength - this.length)
    }
}
/**
 *  @ 格式化时间到给定的字符串模版上
 *  @param Date
 *  @return String
 */
function date_format(_format_str, _date) {
    const date = new Date(_date || Date.now())
    const format_str = _format_str || 'yyyy-MM-dd HH:mm:ss.SSS'
    const _year = date.getFullYear()
    const _month = String(date.getMonth() + 1).padStart(2, '0')
    const _day = String(date.getDate()).padStart(2, '0')
    const _hour = String(date.getHours()).padStart(2, '0')
    const _min = String(date.getMinutes()).padStart(2, '0')
    const _sec = String(date.getSeconds()).padStart(2, '0')
    const _ms = String(date.getMilliseconds()).padStart(3, '0')

    return format_str.replace('yyyy', _year)
        .replace('MM', _month)
        .replace('dd', _day)
        .replace('HH', _hour)
        .replace('mm', _min)
        .replace('ss', _sec)
        .replace('SSS', _ms)
}

const DEFAULT_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS'
class DateFormat {
    constructor(format = DEFAULT_FORMAT, date = new Date()) {
        // this.year = date.getFullYear()
        // this.month = date.getMonth() + 1
        // this.day = date.getDate()
        // this.hour = date.getHours()
        // this.min = date.getMinutes()
        // this.sec = date.getSeconds()
        // this.ms = date.getMilliseconds()
        const [fns, keyMap] = tokenizer(format)
        this.fns = fns
        this.keyMap = keyMap
        this.initDateAndTs(Date.now())
    }
    // change(date= new Date()) {
    //     this.year = date.getFullYear()
    //     this.month = date.getMonth() + 1
    //     this.day = date.getDate()
    //     this.hour = date.getHours()
    //     this.min = date.getMinutes()
    //     this.sec = date.getSeconds()
    //     this.ms = date.getMilliseconds()
    //     return this
    // }

    initDateAndTs(newTs){
        this.date = new Date(Math.floor(newTs/1000)*1000)
        this.ts = this.date - 0
    }

    updateKeyMap(){
        const newTs = Date.now()
        let useCache = true
        if(newTs - this.ts >= 1000){
            useCache = false
            this.initDateAndTs(newTs)
        }
        Object.keys(this.keyMap).forEach((key)=>{
            const val = this.keyMap[key]
            if(!val.get) return // 非yyyy，dd，这类
            if(!val.cache){ // 不走cache，是毫秒
                val.val = newTs % 1000
                return
            }
            if(useCache){
                return
            }else{
                val.val = val.get(this.date)
                return
            }
        })
    }

    toString(){
        this.updateKeyMap()
        return this.fns.map(x => this.keyMap[x].val).join('')
    }
}

/**
 * @param {string} format 
 * @returns {function}
 */
function tokenizer(format) {
    const fns = []
    let buf = []
    let last = undefined
    let keyMap = {}
    for (let index = 0; index < format.length; ++index) {
        const char = format[index]
        const push = ()=>{
            let timeKey = buf.join('')
            fns.push(timeKey)
            buf = []
            keyMap[timeKey] = {}
        }
        if (last !== undefined && last !== char) {
            push()
        }
        buf.push(char)
        last = char
        if (index === format.length - 1){
            push()
        }
    }

    return [fns, createKeyMap(keyMap)]
}


function createKeyMap(keyMap){
    let date = new Date()
    Object.keys(keyMap).forEach((token)=>{
        keyMap[token] = keyMapValInit(token, date)
    })

    return keyMap
}

function keyMapValInit(token, date) {
        let obj = {}
        switch (token[0]) {
            case 'y':
            case 'Y':
                    obj = {
                        get:function(d){
                            return d.getFullYear().toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj
            case 'M':
                    obj = {
                        get:function(d){
                            return (d.getMonth() + 1).toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj

            case 'd':

                    obj = {
                        get:function(d){
                            return d.getDate().toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj

            case 'H':
                    obj = {
                        get:function(d){
                            return d.getHours().toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj

            case 'h':
                    obj = {
                        get:function(d){
                            return (d.getHours() % 12).toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj

            case 'm':
                    obj = {
                        get:function(d){
                            return d.getMinutes().toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj
            case 's':
                    obj = {
                        get:function(d){
                            return d.getSeconds().toString().padStart(token.length, '0')
                        },
                        cache:true,
                    }

                    obj.val = obj.get(date)
                    return obj

            case 'S':
                    obj = {
                        get:function(d){
                            return d.getMilliseconds().toString().padStart(token.length, '0')
                        },
                        cache:false,
                    }

                    obj.val = obj.get(date)
                    return obj

            default:
                return {
                    val: token,
                    get: null,
                }
        }
}

module.exports = {
    date_format,
    DateFormat,
}


if (require.main === module) {
    // const fns = tokenizer(DEFAULT_FORMAT)
    // console.log(DEFAULT_FORMAT, fns)
    const df = new DateFormat(DEFAULT_FORMAT)
    console.log(df.toString())
}