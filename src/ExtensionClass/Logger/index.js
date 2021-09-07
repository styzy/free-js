class Logger {
    constructor(devMode) {
        for (const methodName in window.console) {
            if (window.console.hasOwnProperty.call(window.console, methodName)) {
                const methodFn = window.console[methodName]
                this[methodName] = (...args) => {
                    if (devMode) return methodFn(...args)
                }
            }
        }
    }
}

export default Logger
