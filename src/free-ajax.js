const constants = {
    dataType: {
        json: 'json',
        jsonp: 'jsonp'
    },
    accepts: {
        '*': '*/*',
        'html': 'text/html',
        'json': 'application/json, text/javascript',
        'script': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        'text': 'text/plain',
        'xml': 'application/xml, text/xml'
    },
    typesMap: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']
}

const defaultOptions = {
    url: window.location.href,
    type: 'GET',
    // 布尔值，表示请求是否异步处理。默认是 true
    async: true,
    // 布尔值，表示浏览器是否缓存被请求页面。默认是 true
    // cache: true,
    // 发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"
    contentType: 'application/x-www-form-urlencoded',
    // 为所有 AJAX 相关的回调函数规定 "this" 值
    context: null,
    // 用于创建 XMLHttpRequest 对象的函数
    xhr: null,
    // 布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true
    // global:true,
    // 布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false
    // ifModified:false,
    // 规定请求的字符集
    // scriptCharset:'',
    // 布尔值，规定是否使用参数序列化的传统样式
    // traditional:false,
    // 规定在 HTTP 访问认证请求中使用的用户名
    username: null,
    // 规定在 HTTP 访问认证请求中使用的密码
    password: null,
    // 规定要发送到服务器的数据
    data: null,
    // 预期的服务器响应的数据类型
    dataType: 'json',
    // 用于处理 XMLHttpRequest 原始响应数据的函数
    // dataFilter: null,
    // 布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true
    processData: true,
    // 在一个 jsonp 中重写回调函数的字符串
    jsonp: '',
    // 在一个 jsonp 中规定回调函数的名称
    jsonpCallback: 'jsonpCallback',
    // 发送请求前运行的函数
    beforeSend: null,
    // 设置本地的请求超时时间（以毫秒计）
    timeout: 20000,
    // 如果请求成功要运行的函数
    success: null,
    // 如果请求失败要运行的函数
    error: null,
    // 请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）
    complete: null,
}

let options = null
let XHR = null

// ajax
const ajax = function(userOptions) {
    // 处理options
    options = Object.assign(defaultOptions, userOptions)
    options.type = options.type.toUpperCase()

    if (!typeValid(options.type)) {
        console.error('错误的请求类型type.')
        return false
    }

    switch (options.dataType) {
        case constants.dataType.json:
            ajaxByJson()
            break;
        case constants.dataType.jsonp:
            ajaxByJsonp()
            break;
        default:
            break;
    }
}

/**
 * json
 */
function ajaxByJson() {

    XHR = typeof options.xhr === 'function' ? options.xhr() : createXMLHttpRequest()

    if (!XHR) {
        console.error('浏览器不支持XmlHttpRequest对象，无法使用ajax功能.')
        return false
    }

    //针对某些特定版本的mozillar浏览器的bug进行修正。
    if (XHR.overrideMimeType) {
        XHR.overrideMimeType('text/xml');
    }

    open()

    // 异步
    if (options.async) {
        // XHR.onreadystatechange = readyStateChangeHandler
        XHR.onload = onReceive
        XHR.timeout = options.timeout
        XHR.ontimeout = onTimeout
    }

    onBeforeSend()
    send()

    // 同步
    if (!options.async) {
        onReceive()
    }

    // 初始化一个请求
    function open() {
        let url = options.url
        if (options.type === 'GET') {
            if (options.processData) {
                url += `${url.indexOf('?') === -1 ? '?' : '&'}${data2QueryString(options.data)}`
            } else {
                url += `${url.indexOf('?') === -1 ? '?' : '&'}${options.data}`
            }
        }
        XHR.open(options.type, url, options.async, options.username, options.password)
    }

    // 发送请求
    function send() {
        switch (options.type) {
            case 'GET':
                XHR.send(null)
                break;
            case 'POST':
                XHR.setRequestHeader('Content-type', options.contentType)
                let acceptsArr = []
                if (constants.accepts[options.dataType]) {
                    acceptsArr.push(constants.accepts[options.dataType])
                }
                acceptsArr.push(constants.accepts['*'])
                XHR.setRequestHeader('Accept', acceptsArr.join(', '))
                XHR.send(options.processData ? data2QueryString(options.data) : options.data)
                break;
            default:
                break;
        }
    }

    function readyStateChangeHandler() {
        if (this.readyState === 4) {
            onReceive()
        }
    }

    function onReceive() {
        // HTTP 状态在 200-300 之间表示请求成功
        // HTTP 状态为 304 表示请求内容未发生改变，可直接从缓存中读取
        if (XHR.status >= 200 && XHR.status < 300 || XHR.status === 304) {
            onSuccess(eval(`(${XHR.responseText})`))
        } else {
            onError(XHR.statusText)
        }
    }
}

/**
 * jsonp
 */
function ajaxByJsonp() {
    var timer = null
    var queryStr = options.processData ? data2QueryString(options.data) : options.data
    var callbackName = options.jsonpCallback || ('jsonpcallback_' + Date.now())
    var script_url = `${options.url}?${options.jsonp || 'callback'}=${callbackName}&${queryStr}`

    var el_script = document.createElement('script');
    el_script.src = script_url

    window[callbackName] = callbackHandler

    // 回调处理
    function callbackHandler(json) {
        document.head.removeChild(el_script)
            //TODO回调执行方法
        if (timer) {
            window.clearTimeout(timer)
            timer = null
            delete window[callbackName]
            onSuccess(json)
        }
    }


    onBeforeSend()

    // 插入script
    document.head.appendChild(el_script)

    // 超时定时器
    if (options.timeout) {
        timer = window.setTimeout(function() {
            timer = null
            document.head.removeChild(el_script)
            delete window[callbackName]
            onTimeout()
        }, options.timeout)
    }
}

/*************************钩子函数**************************/

function onBeforeSend() {
    if (typeof options.beforeSend === 'function') {
        if (options.context) {
            options.beforeSend.call(options.context, XHR)
        } else {
            options.success(XHR)
        }
    }
}

function onSuccess(data) {
    if (typeof options.success === 'function') {
        if (options.context) {
            options.success.call(options.context, data, XHR ? XHR.status : undefined, XHR)
        } else {
            options.success(data, XHR ? XHR.status : undefined, XHR)
        }
    }
    onComplete()
}

function onError(error) {
    if (typeof options.error === 'function') {
        if (options.context) {
            options.error.call(options.context, XHR, XHR ? XHR.status : undefined, error)
        } else {
            options.error(XHR, XHR ? XHR.status : undefined, error)
        }
    }
    onComplete()
}

function onComplete() {
    if (typeof options.complete === 'function') {
        if (options.context) {
            options.complete.call(options.context, XHR, XHR ? XHR.status : undefined)
        } else {
            options.complete(XHR, XHR ? XHR.status : undefined)
        }
    }
}

function onTimeout() {
    onError('请求超时')
}

/*************************工具函数**************************/

/**
 * 创建XmlHttpRequest实例对象
 */
function createXMLHttpRequest() {
    var XHR = null;
    if (window.ActiveXObject) {
        XHR = new ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    }
    return XHR
}

/**
 * 验证type
 * @param {String} type 
 */
function typeValid(type) {
    return constants.typesMap.some(item => item === type)
}

/**
 * data转换urlQueryString
 * @param {*} data 
 */
function data2QueryString(data) {
    if (data) {
        var array = []
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                array.push(`${window.encodeURIComponent(key)}=${window.encodeURIComponent(item)}`)
            }
        }
        return array.join('&')
    } else {
        return ''
    }
}

export default ajax