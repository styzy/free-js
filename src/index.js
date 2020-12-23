import Core from './Core'
import ajax from './ajax'
import forEach from './forEach'
import load from './load'
import utils from './utils'
import Color from './color'
import Logger from './Logger'
import components from './components'
import classesExtendMethdos from './classesExtendMethods'
import logo from './logo'

class Free {
    constructor(devMode = !!devMode) {
        const core = new Core(devMode)

        core.ajax = ajax
        core.awesome = awesome
        core.color = color
        core.components = components
        core.forEach = forEach
        core.load = load
        core.logger = new Logger(core)
        core.utils = utils
        core.devMode && logo(core)
        return core
    }
}

const awesome = () => {
    applyClassesExtendMethdos()
    return 'owesome'
}

const color = (...args) => {
    return new Color(...args)
}

const applyClassesExtendMethdos = () => {
    for (const className in classesExtendMethdos) {
        if (classesExtendMethdos.hasOwnProperty(className)) {
            if (window[className]) {
                for (const methodName in classesExtendMethdos[className]) {
                    if (classesExtendMethdos[className].hasOwnProperty(methodName)) {
                        const method = classesExtendMethdos[className][methodName]
                        window[className].prototype[methodName] = method
                    }
                }
            }
        }
    }
}

export { Free }

export default Free
