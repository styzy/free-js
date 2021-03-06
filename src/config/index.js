export const version = '1.8.6'
export const buildTime = timeFormat(BUILD_TIME)
export const githubUrl = 'https://github.com/styzy/free-js'

function timeFormat(stamp) {
    let date = new Date(stamp)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export default {
    version,
    buildTime,
    githubUrl
}
