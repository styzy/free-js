const loadJs = function (url, { error = null, load = null, charset = '', async = true, type = 'text/javascript' } = {}) {
    let script = document.createElement('script')
    script.src = url
    script.type = type
    if (charset) {
        script.charset = charset
    }
    script.onload = load
    script.onerror = error
    document.head.appendChild(script)
}

export default loadJs
