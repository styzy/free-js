import { createXMLHttpRequest } from '../utils'

const CONSTANTS = {
    DATA_TYPE: {
        JSON: 'json',
        JSONP: 'jsonp'
    },
    ACCEPTS: {
        '*': '*/*',
        html: 'text/html',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        text: 'text/plain',
        xml: 'application/xml, text/xml'
    },
    TYPES: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        OPTIONS: 'OPTIONS',
        PATCH: 'PATCH',
        HEAD: 'HEAD'
    },
    CONTENT_TYPE: {
        DEFAULT: 'application/x-www-form-urlencoded; charset=UTF-8',
        APPLICATION_JSON: 'application/json; charset=UTF-8'
    }
}

// 默认参数模板
const defaultOptionsTemplate = {
    url: window.location.href,
    type: CONSTANTS.TYPES.GET,
    // 布尔值，表示请求是否异步处理。默认是 true
    async: true,
    // 发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"
    contentType: CONSTANTS.CONTENT_TYPE.DEFAULT,
    // 预期的服务器响应的数据类型
    dataType: CONSTANTS.DATA_TYPE.JSON,
    // 规定要发送到服务器的数据
    data: null,
    // 用于处理 XMLHttpRequest 原始响应数据的函数
    dataFilter: null,
    // 布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true
    processData: true,
    // 设置本地的请求超时时间（以毫秒计）
    timeout: 20000,
    // 在一个 jsonp 中重写回调函数的字符串
    jsonp: 'callback',
    // 在一个 jsonp 中规定回调函数的名称
    jsonpCallback: '',
    // 为所有 AJAX 相关的回调函数规定 "this" 值
    context: null,
    // 用于创建 XMLHttpRequest 对象的函数
    xhr: null,
    // 布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true
    global: true,
    // 规定在 HTTP 访问认证请求中使用的用户名
    username: null,
    // 规定在 HTTP 访问认证请求中使用的密码
    password: null,
    // 发送请求前运行的函数
    beforeSend: null,
    // 如果请求成功要运行的函数
    success: null,
    // 如果请求失败要运行的函数
    error: null,
    // 请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）
    complete: null
    // 布尔值，表示浏览器是否缓存被请求页面。默认是 true
    // cache: true,
    // 布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false
    // ifModified:false,
    // 规定请求的字符集
    // scriptCharset:'',
    // 布尔值，规定是否使用参数序列化的传统样式
    // traditional:false
}

// 全局参数
let globalOptions = {
    urlFormatter: null,
    type: defaultOptionsTemplate.type,
    async: defaultOptionsTemplate.async,
    contentType: defaultOptionsTemplate.contentType,
    dataType: defaultOptionsTemplate.dataType,
    dataFormatter: null,
    dataFilter: null,
    processData: defaultOptionsTemplate.processData,
    timeout: defaultOptionsTemplate.timeout,
    jsonp: defaultOptionsTemplate.jsonp,
    jsonpCallback: null,
    context: defaultOptionsTemplate.context,
    username: defaultOptionsTemplate.username,
    password: defaultOptionsTemplate.password,
    beforeSend: null,
    success: null,
    error: null,
    complete: null,
    xhr: defaultOptionsTemplate.xhr
}

/**
 * ajax
 * @param {Object} userOptions
 */
const ajax = function (userOptions) {
    let options = null,
        XHR = null,
        useGlobal = userOptions.global !== false,
        promise = {
            success: null,
            error: null,
            complete: null
        },
        promiseHandler = {
            success(cb) {
                promise.success = cb
                return this
            },
            error(cb) {
                promise.error = cb
                return this
            },
            complete(cb) {
                promise.complete = cb
                return this
            }
        }

    // 创建options
    options = createOptions(userOptions, useGlobal)

    if (!ckeckType(options.type)) {
        console.error('错误的请求类型type： ' + options.type)
        return
    }

    switch (options.dataType) {
        case CONSTANTS.DATA_TYPE.JSON:
            ajaxByJson()
            break
        case CONSTANTS.DATA_TYPE.JSONP:
            ajaxByJsonp()
            break
        default:
            break
    }

    return promiseHandler

    /**
     * json
     */
    function ajaxByJson() {
        XHR = isFunction(options.xhr) ? options.xhr() : createXMLHttpRequest()

        if (!XHR) {
            console.error('浏览器不支持XMLHttpRequest对象，无法使用ajax功能.')
            return
        }

        //针对某些特定版本的mozillar浏览器的bug进行修正。
        if (XHR.overrideMimeType) {
            XHR.overrideMimeType('text/xml')
        }

        open()

        // 异步
        if (options.async) {
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
            XHR.open(options.type, options.url, options.async, options.username, options.password)
        }

        // 发送请求
        function send() {
            if (options.type === CONSTANTS.TYPES.POST) {
                XHR.setRequestHeader('Content-Type', options.contentType)
                let acceptsArr = []
                if (CONSTANTS.ACCEPTS[options.dataType]) {
                    acceptsArr.push(CONSTANTS.ACCEPTS[options.dataType])
                }
                acceptsArr.push(CONSTANTS.ACCEPTS['*'])
                XHR.setRequestHeader('Accept', acceptsArr.join(', '))
            }
            XHR.send(options.data)
        }

        function onReceive() {
            let responseText = XHR.responseText

            if (useGlobal && isFunction(globalOptions.dataFilter)) {
                responseText = globalOptions.dataFilter(responseText, options.dataType)
            }

            if (isFunction(options.dataFilter)) {
                responseText = options.dataFilter(responseText, options.dataType)
            }

            // HTTP 状态在 200-300 之间表示请求成功
            // HTTP 状态为 304 表示请求内容未发生改变，可直接从缓存中读取
            if ((XHR.status >= 200 && XHR.status < 300) || XHR.status === 304) {
                onSuccess(eval(`(${responseText})`))
            } else {
                onError(XHR.statusText)
            }
        }
    }

    /**
     * jsonp
     */
    function ajaxByJsonp() {
        let timer = null,
            jsonpCallback = options.jsonpCallback || `jsonpcallback_${Date.now()}`,
            url = `${options.url}${options.url.includes('?') ? '&' : '?'}${options.jsonp}=${jsonpCallback}${options.data ? '&' : ''}${options.data}`,
            el_script = document.createElement('script')

        el_script.src = url

        window[jsonpCallback] = callbackHandler

        onBeforeSend()

        // 插入script
        document.head.appendChild(el_script)

        // 超时定时器
        if (options.timeout) {
            timer = window.setTimeout(timeoutHandler, options.timeout)
        }

        // 回调处理
        function callbackHandler(json) {
            if (timer) {
                window.clearTimeout(timer)
                timer = null
            }
            document.head.removeChild(el_script)
            delete window[jsonpCallback]

            if (useGlobal && isFunction(globalOptions.dataFilter)) {
                json = globalOptions.dataFilter(json, options.dataType)
            }

            if (isFunction(options.dataFilter)) {
                json = options.dataFilter(json, options.dataType)
            }

            onSuccess(json)
        }

        // 超时处理
        function timeoutHandler() {
            timer = null
            document.head.removeChild(el_script)
            window[jsonpCallback] = function () {
                delete window[jsonpCallback]
            }
            onTimeout()
        }
    }

    /*************************钩子函数**************************/

    function onBeforeSend() {
        if (useGlobal && isFunction(globalOptions.beforeSend)) {
            doCallback(globalOptions.beforeSend, XHR)
        }
        if (isFunction(options.beforeSend)) {
            doCallback(options.beforeSend, XHR)
        }
    }

    function onSuccess(data) {
        if (useGlobal && isFunction(globalOptions.success)) {
            doCallback(globalOptions.success, data, XHR ? XHR.status : undefined, XHR)
        }
        if (isFunction(options.success)) {
            doCallback(options.success, data, XHR ? XHR.status : undefined, XHR)
        }
        if (isFunction(promise.success)) {
            doCallback(promise.success, data, XHR ? XHR.status : undefined, XHR)
        }
        onComplete()
    }

    function onError(error) {
        if (useGlobal && isFunction(globalOptions.error)) {
            doCallback(globalOptions.error, XHR, XHR ? XHR.status : undefined, error)
        }
        if (isFunction(options.error)) {
            doCallback(options.error, XHR, XHR ? XHR.status : undefined, error)
        }
        if (isFunction(promise.error)) {
            doCallback(promise.error, XHR, XHR ? XHR.status : undefined, error)
        }
        onComplete()
    }

    function onComplete() {
        if (useGlobal && isFunction(globalOptions.complete)) {
            doCallback(globalOptions.complete, XHR, XHR ? XHR.status : undefined)
        }
        if (isFunction(options.complete)) {
            doCallback(options.complete, XHR, XHR ? XHR.status : undefined)
        }
        if (isFunction(promise.complete)) {
            doCallback(promise.complete, XHR, XHR ? XHR.status : undefined)
        }
    }

    function onTimeout() {
        onError('请求超时')
    }

    function doCallback(fn, ...args) {
        if (options.context) {
            fn.call(options.context, ...args)
        } else {
            fn(...args)
        }
    }
}

/**
 * 创建参数
 * @param {Object} userOptions
 * @param {Boolean} useGlobal
 */
function createOptions(userOptions, useGlobal) {
    let defaultOptions = createDefaultOptions(useGlobal),
        options = syncOptions(defaultOptions, userOptions)

    options.type = options.type.toUpperCase()

    if (useGlobal && isFunction(globalOptions.urlFormatter)) {
        options.url = globalOptions.urlFormatter(options.url)
    }

    if (useGlobal && isFunction(globalOptions.dataFormatter)) {
        options.data = globalOptions.dataFormatter(options.data)
    }

    if (!options.contentType.includes('charset=UTF-8')) {
        options.contentType += '; charset=UTF-8'
    }
    switch (options.dataType) {
        case CONSTANTS.DATA_TYPE.JSON:
            if (options.type !== CONSTANTS.TYPES.POST) {
                options.contentType = CONSTANTS.CONTENT_TYPE.DEFAULT
            }
            if (options.contentType.includes('application/json')) {
                if (options.processData) {
                    if (options.data && typeof options.data !== 'string') {
                        options.data = JSON.stringify(options.data)
                    }
                }
            } else if (options.contentType.includes('application/x-www-form-urlencoded')) {
                if (options.processData) {
                    options.data = data2QueryString(options.data)
                }
            } else {
                if (options.processData) {
                    options.data = data2QueryString(options.data)
                }
            }
            if (options.type === CONSTANTS.TYPES.GET) {
                if (options.data) {
                    options.url += `${options.url.includes('?') ? '&' : '?'}${options.data}`
                }
                options.data = null
            }
            break
        case CONSTANTS.DATA_TYPE.JSONP:
            options.data = data2QueryString(options.data)
            if (useGlobal && !options.jsonpCallback && isFunction(globalOptions.jsonpCallback)) {
                options.jsonpCallback = globalOptions.jsonpCallback()
            }
            break
        default:
            break
    }

    return options
}

/**
 * 创建默认参数
 * @param {Boolean} useGlobal 是否使用全局参数
 */
function createDefaultOptions(useGlobal) {
    let defaultOptions = Object.assign({}, defaultOptionsTemplate)
    if (useGlobal) {
        let syncList = ['type', 'async', 'contentType', 'dataType', 'processData', 'timeout', 'jsonp', 'context', 'username', 'password', 'xhr']
        syncList.forEach((key) => {
            defaultOptions[key] = globalOptions[key]
        })
    }
    return defaultOptions
}

/**
 * 同步参数
 * @param {Object} defaultOptions
 * @param {Object} userOptions
 */
function syncOptions(defaultOptions, userOptions) {
    for (const key in defaultOptions) {
        if (userOptions.hasOwnProperty(key)) {
            defaultOptions[key] = userOptions[key]
        }
    }
    return defaultOptions
}

/**
 * 全局参数
 * @param {Object} options
 */
function setGlobalOptions(options) {
    try {
        for (const key in options) {
            if (globalOptions.hasOwnProperty(key)) {
                globalOptions[key] = options[key]
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function ckeckType(type) {
    return Object.values(CONSTANTS.TYPES).some((t) => {
        return type === t
    })
}

/**
 * data转换urlQueryString
 * @param {*} data
 */
function data2QueryString(data) {
    if (!data) return ''
    if (typeof data === 'string') {
        return data
    } else if (typeof data === 'object') {
        var array = []
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key]
                array.push(`${window.encodeURIComponent(key)}=${window.encodeURIComponent(item)}`)
            }
        }
        return array.join('&')
    } else {
        return ''
    }
}

function isFunction(fn) {
    return typeof fn === 'function'
}

ajax.global = setGlobalOptions

export default ajax
