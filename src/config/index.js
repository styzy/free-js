export const version = '1.0.5'
export const devMode = devModeCheck()
export const buildTime = timeFormat(BUILD_TIME)
export const githubUrl = 'https://github.com/styzy/free-js'

function timeFormat(stamp) {
    let date = new Date(stamp)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function devModeCheck() {
    let el_script = document.querySelector('script[src*="free.js"]')
    if (el_script.hasAttribute('devMode')) {
        return true
    }
    return false
}

export default {
    version,
    devMode,
    buildTime,
    githubUrl
}