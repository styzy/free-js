// 获取结对高度
const getOffsetY = function(e) {
    var offset = e.offsetTop
    if (e.offsetParent != null) offset += getTop(e.offsetParent)
    return offset
};

export default getOffsetY