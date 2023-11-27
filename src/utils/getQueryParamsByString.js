/**
 * 根据字符串获取查询参数对象
 * @param {string} str 被查询的字符串
 * @param {string} keyName 查询结果的key
 * @returns
 */
export default function (str = '') {
    const theRequest = new Object()

    if (str.indexOf('?') != -1) {
        str = str.substr(str.indexOf('?') + 1)
        if (str.indexOf('#') > 0) {
            str = str.replace(str.substr(str.indexOf('#')), '')
        }
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
    }

    return theRequest
}
