import { version, devMode } from './config'

class Core {
    constructor() {
        let free = get
        free.utils = {}
        free.version = version
        free.devMode = devMode
        return free
    }
}

function get(selector) {
    let nodeList = document.querySelectorAll(selector)
    if (nodeList.length) {
        if (nodeList.length === 1) {
            return nodeList[0]
        } else {
            return nodeList
        }
    } else {
        return null
    }
}

export default new Core()