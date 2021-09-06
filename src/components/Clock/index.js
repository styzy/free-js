import CONSTANTS from './CONSTANTS'
import { typeOf } from '../../utils'

const timeCreator = () => {
    let time = new Date()
    return {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        date: time.getDate(),
        hour: time.getHours(),
        min: time.getMinutes(),
        sec: time.getSeconds()
    }
}

const defaultFormatter = ({ year, month, date, hour, min, sec }) => {
    return `${year}-${numberFixed(month)}-${numberFixed(date)} ${numberFixed(hour)}:${numberFixed(min)}:${numberFixed(sec)}`

    function numberFixed(number) {
        return `${number < 10 ? '0' : ''}${number}`
    }
}

class Clock {
    #el
    #formatter
    #processId
    constructor(el, formatter = defaultFormatter) {
        if (typeOf(el) === 'String') {
            el = document.querySelector(el)
        }

        this.#el = el
        this.#el = el
        this.#formatter = formatter
        this.#process(timeCreator())
        this.#addProcess()
    }
    #addProcess() {
        if (!this.#checkProcessStack()) {
            this.#createProcessStack()
        }
        let processStack = this.#getProcessStack(),
            processId = this.#createProcessId()
        this.#processId = processId
        processStack[processId] = this.#process
    }
    #removeProcess() {
        let processStack = this.#getProcessStack()
        delete processStack[this.#processId]
    }
    #checkProcessStack() {
        return !!window[CONSTANTS.CLOCK_INTERVAL_PORCESS_STACK_NAME]
    }
    #createProcessStack() {
        let processStack = {},
            interval = window.setInterval(() => {
                let processList = Object.values(processStack)
                if (!processList.length) {
                    this.#clearInterval()
                    return
                }
                processList.forEach((process) => {
                    if (process instanceof Function) {
                        process.call(this, timeCreator())
                    }
                })
            }, 1000)
        window[CONSTANTS.CLOCK_INTERVAL_NAME] = interval
        window[CONSTANTS.CLOCK_INTERVAL_PORCESS_STACK_NAME] = processStack
        window[CONSTANTS.CLOCK_INTERVAL_PROCESS_SEED] = 0
    }
    #clearInterval() {
        window.clearInterval(window[CONSTANTS.CLOCK_INTERVAL_NAME])
    }
    #getProcessStack() {
        return window[CONSTANTS.CLOCK_INTERVAL_PORCESS_STACK_NAME]
    }
    #createProcessId() {
        return `clock-${++window[CONSTANTS.CLOCK_INTERVAL_PROCESS_SEED]}`
    }
    #process(...args) {
        this.#el.innerText = this.#formatter(...args)
    }
    destroy() {
        this.#el.innerText = ''
        this.#removeProcess()
    }
}

export default Clock
