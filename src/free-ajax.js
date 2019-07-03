// ajax
const ajax = function(params) {
    var XHR;
    if (window.ActiveXObject) {
        XHR = new ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = null;
    }

    //针对某些特定版本的mozillar浏览器的bug进行修正。
    if (XHR.overrideMimeType) {
        XHR.overrideMimeType('text/xml');
    }

    var finParams = {
        type: ((params.type) ? params.type : 'GET'),
        url: ((params.url) ? params.url : null),
        async: ((typeof(params.async) == 'undefined') ? true : params.async),
        data: ((params.data) ? params.data : null),
        dataType: ((params.dataType) ? params.dataType : 'json'),
        callback: ((params.callback) ? params.callback : 'jsoncallback'),
        time: ((params.time) ? params.time : null),
        beforeSend: ((params.beforeSend) ? params.beforeSend : null),
        success: ((params.success) ? params.success : null),
        error: ((params.error) ? params.error : null),
    };

    //jsonp
    if (finParams.dataType == 'jsonp') {
        var jsonp = {};

        //创建script标签
        jsonp.head = document.getElementsByTagName('head')[0];
        jsonp.scriptTag = document.createElement('script');
        jsonp.head.appendChild(jsonp.scriptTag);

        //创建callback
        jsonp.callbackName = ('jsonp_' + Math.random()).replace('.', '');
        finParams.data[finParams.callback] = jsonp.callbackName

        //参数格式转换成字符串
        dataFormat();

        //callback注册到window对象
        window[jsonp.callbackName] = function(json) {
            jsonp.head.removeChild(jsonp.scriptTag);
            clearTimeout(jsonp.timer);
            window[jsonp.callbackName] = null;
            finParams.success && finParams.success(json)
        }

        //发送请求
        jsonp.scriptTag.src = finParams.url + '?' + finParams.data

        //超时处理
        if (finParams.time) {
            jsonp.timer = setTimeout(function() {
                window[jsonp.callbackName] = null;
                jsonp.head.removeChild(jsonp.scriptTag);
                finParams.error && finParams.error({
                    message: '请求超时!'
                })
            }, finParams.time)
        }
    }
    //json
    else {
        //参数格式转换成字符串
        dataFormat();

        //注册回调函数
        XHR.onreadystatechange = function() {
            //判断对象状态是交互完成，接收服务器返回的数据
            if (XHR.readyState == 4) {
                if (XHR.status == 200) {
                    var json = eval('(' + XHR.responseText + ')')
                    finParams.success && finParams.success(json);
                } else {
                    finParams.error && finParams.error();
                }
            }
        };

        //封装请求
        XHR.open(finParams.type, finParams.url, finParams.async);
        if (finParams.beforeSend != null) {
            finParams.beforeSend();
        }
        if (finParams.type == 'POST') {
            XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        //发出请求
        XHR.send(finParams.data);
    }

    //将data的json转换为url中的参数
    function dataFormat() {
        if (finParams.data) {
            var dataStr = '';
            for (var item in finParams.data) {
                dataStr += item + '=' + finParams.data[item] + '&'
            }
            dataStr = dataStr.substring(0, dataStr.length - 1);
            finParams.data = dataStr;
        }
    }
}

export default ajax