// 获取url的query对象
const getUrlQueryParams = function(keyName) {
    var url = window.location.href
    var theRequest = new Object()
    if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?") + 1)
        if (str.indexOf("#") > 0) {
            str = str.replace(str.substr(str.indexOf("#")), "")
        }
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
        }
    }
    if (keyName) {
        return theRequest[keyName]
    } else {
        return theRequest
    }
};

export default getUrlQueryParams