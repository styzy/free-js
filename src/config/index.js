import _Date from '../NativeClass/Date'
import { version } from '../../package.json'

export { version }
export const buildTime = _Date.format(new Date(BUILD_TIME))
export const githubUrl = 'https://github.com/styzy/free-js'

export default {
    version,
    buildTime,
    githubUrl
}
