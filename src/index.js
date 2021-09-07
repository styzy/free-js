import Core from './Core'
import Color from './ExtensionClass/Color'
import NativeClass, { nativeClassExtensions } from './NativeClass'
import ExtensionClass from './ExtensionClass'
import Components from './Components'
import ajax from './ajax'
import forEach from './forEach'
import load from './load'
import utils from './utils'
import printLogo from './printLogo'

class Free {
    static get String() {
        return NativeClass.String
    }
    static get Element() {
        return NativeClass.Element
    }
    static get Date() {
        return NativeClass.Date
    }
    static get Color() {
        return ExtensionClass.Color
    }
    static get Logger() {
        return ExtensionClass.Logger
    }
    static get Components() {
        return Components
    }
    #devMode = false
    #awesomeMode = false
    constructor({ devMode = !!devMode, awesomeMode = !!awesomeMode } = {}) {
        this.#devMode = devMode
        this.#awesomeMode = awesomeMode

        // 实例化核心
        const core = new Core()

        // 功能挂载
        core.ajax = ajax
        core.forEach = forEach
        core.load = load
        core.utils = utils

        core.awesome = () => this.#awesome()
        core.color = (...args) => {
            return new ExtensionClass.Color(...args)
        }
        core.logger = new ExtensionClass.Logger(devMode)

        if (devMode) {
            printLogo(core)
        }
        if (awesomeMode) {
            core.awesome()
        }
        return core
    }
    #awesome() {
        forEach(nativeClassExtensions, (extensions) => {
            const prototype = window[extensions.className].prototype
            for (const methodName in extensions.methods) {
                prototype[methodName] = extensions.methods[methodName]
            }
        })
        if (this.#devMode) {
            console.log('%c' + '[Free] Awesome mode online!\n', 'color:#00b1e6;font-weight:600;')
        }
    }
}

// const applyClassesExtendMethdos = () => {
//     for (const className in classesExtendMethdos) {
//         if (classesExtendMethdos.hasOwnProperty(className)) {
//             if (window[className]) {
//                 for (const methodName in classesExtendMethdos[className]) {
//                     if (classesExtendMethdos[className].hasOwnProperty(methodName)) {
//                         const method = classesExtendMethdos[className][methodName]
//                         window[className].prototype[methodName] = method
//                     }
//                 }
//             }
//         }
//     }
// }

export { Free }

export default Free
