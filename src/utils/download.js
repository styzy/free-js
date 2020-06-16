const download = function (url, fileName = getFileName(url)) {
    if (checkOrigin(url)) {
        // 同域
        let el = document.createElement('a')
        el.setAttribute('download', fileName)
        el.href = url
        el.click()
    } else {
        // 跨域
        crossOriginDownload(url, fileName)
    }
}

function crossOriginDownload(url, fileName) {
    let xhr = new XMLHttpRequest()
    if (!xhr) {
        throw new Error('当前浏览器不支持XMLHttpRequest，无法下载')
    }
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
        let url = window.URL.createObjectURL(xhr.response),
            el = document.createElement('a')
        el.href = url
        el.download = fileName
        el.click()
    }
    xhr.send()
}

function checkOrigin(url) {
    let localUrl = new URL(window.location.href)
    try {
        let targetUrl = new URL(url)
        return localUrl.origin === targetUrl.origin
    } catch (error) {
        throw new Error(`错误的下载地址${url}`)
    }
}

function getFileName(url) {
    return url.split('/')[url.split('/').length - 1] || ''
}

export default download
