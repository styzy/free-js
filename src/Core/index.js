import { version, buildTime, githubUrl } from '../config'
import { findDom } from '../utils'
class Core {
    constructor(devMode) {
        const free = (...args) => {
            return findDom(...args)
        }
        free.utils = {}
        free.devMode = devMode
        free.version = version
        free.buildTime = buildTime
        free.githubUrl = githubUrl
        return free
    }
}

export default Core
