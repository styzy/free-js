import typeOf from './typeOf'

const deepCloneFunction = function (func) {
    const type = typeOf(func)

    if (type !== 'Function') throw new Error(`deepCloneFunction方法参数必须为 Function 类型,而不是 ${type} 类型`)

    return new Function(`return ${func.toString()}`)()
}

export default deepCloneFunction
