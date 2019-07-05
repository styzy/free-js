// iframe是否跨域
const isIframeCrossOrigin = function(iframe) {
    var isCrossOrigin = false
    try {
        var test = !iframe.contentWindow.location.href
    } catch (e) {
        isCrossOrigin = true
    }
    return isCrossOrigin
}

export default isIframeCrossOrigin