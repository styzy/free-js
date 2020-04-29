import { loadCss, loadJs, loadXml } from '../utils'

const CONSTANTS = {
    TYPES: {
        JS: 'js',
        CSS: 'css',
        XML: 'xml'
    }
}

function load(
    url = '',
    options = {
        error: null,
        load: null
    }
) {
    if (!url || typeof url !== 'string') {
        throw new Error(`错误的url：${url}`)
    }
    let type = getTypeByUrl(url)
    switch (type) {
        case CONSTANTS.TYPES.JS:
            loadJs(url, options)
            break
        case CONSTANTS.TYPES.CSS:
            loadCss(url, options)
            break
        case CONSTANTS.TYPES.XML:
            loadXml(url, options)
            break
        default:
            throw new Error(`未知的类型：${type}`)
            break
    }
}

function getTypeByUrl(url) {
    return url.split('.')[url.split('.').length - 1]
}

export default load
