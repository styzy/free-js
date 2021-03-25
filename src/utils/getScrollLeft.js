const getScrollLeft = function () {
    return document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
}

export default getScrollLeft
