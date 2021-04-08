import { typeOf } from '../utils'

const control = {
    break: Symbol('break'),
    continue: Symbol('continue')
}

class Control {
    #needBreak = false
    #needContinue = false
    #needReturn = false
    #needReturnData
    get needBreak() {
        return this.#needBreak
    }
    get needContinue() {
        return this.#needContinue
    }
    get needReturn() {
        return this.#needReturn
    }
    get needReturnData() {
        return this.#needReturnData
    }
    constructor() {}
    break() {
        this.#needBreak = true
    }
    continue() {
        this.#needContinue = true
    }
    return(data) {
        this.#needReturn = true
        this.#needReturnData = data
    }
}

const forEach = function (param = [], fn = () => {}) {
    try {
        const forFn = getForFn(param)
        if (!forFn) throw '第一个参数支持Number、Array和NodeList类型'
        if (typeOf(fn) !== 'Function') throw '第二个参数必须为Function类型'
        return forFn(param, fn)
    } catch (error) {
        console.error(`forEach error: ${error}`)
        return
    }
}

function getForFn(param) {
    const type = typeOf(param)

    switch (type) {
        case 'Array':
            return forArray
        case 'Number':
            return forNumber
        case 'NodeList':
            return forNodeList
        default:
            return
    }
}

function forArray(array, fn) {
    const control = new Control()

    for (let index = 0, length = array.length; index < length; index++) {
        fn(array[index], index, control)

        if (control.needBreak) break
        if (control.needContinue) continue
        if (control.needReturn) return control.needReturnData
    }
}

function forNumber(number, fn) {
    const control = new Control()

    for (let index = 0; index < number; index++) {
        fn(index, index, control)

        if (control.needBreak) break
        if (control.needContinue) continue
        if (control.needReturn) return control.needReturnData
    }
}

function forNodeList(nodeList, fn) {
    const control = new Control()

    for (let index = 0, length = nodeList.length; index < length; index++) {
        fn.call(nodeList[index], nodeList[index], index, control)

        if (control.needBreak) break
        if (control.needContinue) continue
        if (control.needReturn) return control.needReturnData
    }
}

function isNumber(number) {
    return !isNaN(new Number(number))
}

export default forEach
