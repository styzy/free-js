import { version, buildTime, githubUrl } from '../config'
import _Element from '../NativeClass/Element'
class Core {
    constructor() {
        const free = (...args) => {
            return _Element.find(...args)
        }

        free.version = version
        free.buildTime = buildTime
        free.githubUrl = githubUrl

        return free
    }
}

export default Core
