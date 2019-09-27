import { devMode, version, buildTime, githubUrl } from './config'

class Core {
    constructor() {
        let free = get
        free.utils = {}
        free.devMode = devMode
        free.version = version
        free.buildTime = buildTime
        free.githubUrl = githubUrl
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