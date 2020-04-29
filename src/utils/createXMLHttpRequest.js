const createXMLHttpRequest = function () {
    let XHR = null
    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
        XHR = new ActiveXObject('Microsoft.XMLHTTP')
    }
    return XHR
}
export default createXMLHttpRequest
