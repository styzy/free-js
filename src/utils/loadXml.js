import createXMLHttpRequest from './createXMLHttpRequest'

const loadXml = function (url, { error = null, load = null, async = true, timeout = 20000 } = {}) {
    let XHR = createXMLHttpRequest()
    if (!XHR) throw new Error('浏览器不支持XMLHttpRequest对象，无法加载XML')
    XHR.timeout = timeout
    XHR.onload = loadHandler
    XHR.ontimeout = error
    XHR.open('get', url, true)
    XHR.send()

    function loadHandler() {
        if (this.readyState == 4 && this.status == 200) {
            //获取返回的xml
            let xml = this.responseXML
            if (typeof load === 'function') {
                load.call(this, xml)
            }
        } else {
            if (typeof error === 'function') {
                error.call(this)
            }
        }
    }
}

export default loadXml
