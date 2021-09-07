const find = function (selector = '', returnNodeList = !!returnNodeList, parentNode = document) {
    try {
        if (returnNodeList) {
            return parentNode.querySelectorAll(selector)
        } else {
            return parentNode.querySelector(selector)
        }
    } catch (error) {
        if (returnNodeList) {
            return []
        } else {
            return null
        }
    }
}

export default find
