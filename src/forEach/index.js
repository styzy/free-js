const forEach = function (array = [], fn = () => {}) {
    try {
        if (!(array instanceof Array) && !(array instanceof NodeList)) throw '第一个参数必须为Array或NodeList类型'
        if (!(fn instanceof Function)) throw '第二个参数必须为Function类型'

        const _break = Symbol('break')

        for (let index = 0, length = array.length; index < length; index++) {
            const item = array[index]
            if (_break === fn.call(item, item, index, _break)) {
                break
            }
        }
    } catch (error) {
        throw `forEach error: ${error}`
    }
}

export default forEach
