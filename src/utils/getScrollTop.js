const getScrollTop = function () {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
}

export default getScrollTop
