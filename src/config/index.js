import _Date from '../NativeClass/Date'

export const version = '2.0.0'
export const buildTime = _Date.format(new Date(BUILD_TIME))
export const githubUrl = 'https://github.com/styzy/free-js'

export default {
    version,
    buildTime,
    githubUrl
}
