class Core {
    constructor() {
        let free = get
        free.utils = {}
            // free.log = null
        free.version = '1.0.0'
        free.devMode = false
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