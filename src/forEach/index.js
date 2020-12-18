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
    let forFn
    try {
        if (param instanceof Array) forFn = forArray
        if (param instanceof NodeList) forFn = forNodeList
        if (isNumber(param)) forFn = forNumber
        if (!forFn) throw '第一个参数支持Number、Array和NodeList类型'
        if (!(fn instanceof Function)) throw '第二个参数必须为Function类型'
    } catch (error) {
        console.error(`forEach error: ${error}`)
        return
    }

    return forFn(param, fn)
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
