import core from './free-core'
import ajax from './free-ajax'
import utils from './utils'
import Log from './free-log'
import classesExtendMethdos from './classesExtendMethods'
import logo from './free-logo'

const existOtherInstance = !!window.free

if (!existOtherInstance) {
    core.utils = utils
    core.ajax = ajax
    core.Log = () => {
        return new Log({ devMode: core.devMode })
    }
    core.awesome = () => {
        return applyClassesExtendMethdos.call(core, classesExtendMethdos)
    }
    core.devMode && logo(core)
} else {
    console.warn('free-js无法使用，free关键字占用')
}

function applyClassesExtendMethdos(classesExtendMethdos) {
    for (const className in classesExtendMethdos) {
        if (classesExtendMethdos.hasOwnProperty(className)) {
            if (window[className]) {
                for (const methodName in classesExtendMethdos[className]) {
                    if (classesExtendMethdos[className].hasOwnProperty(methodName)) {
                        const method = classesExtendMethdos[className][methodName];
                        window[className].prototype[methodName] = method
                    }
                }
            }
        }
    }
    return 'owesome'
}


!window.free && (window.free = core)

export default core