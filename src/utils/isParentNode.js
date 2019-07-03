// 是否是父节点
const isParentNode = function(obj, parentObj) {
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode
    }
    return false
}

export default isParentNode