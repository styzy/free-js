class Logger {
    #core
    constructor(core) {
        this.#core = core
        for (const methodName in window.console) {
            if (window.console.hasOwnProperty.call(window.console, methodName)) {
                const methodFn = window.console[methodName]
                this[methodName] = (...args) => {
                    if (this.#core.devMode) return methodFn(...args)
                }
            }
        }
    }
}

export default Logger
