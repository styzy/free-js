const parseXml = function (xml) {
    if (!(xml instanceof XMLDocument)) throw new Error('错误的xml')
    let node = xml.children[0]
    if (!node) return
    let object = {}

    parse(node, object)

    return object

    function parse(node, parentObject) {
        if (node.childElementCount) {
            parentObject[node.nodeName] = {}
            for (let index = 0, length = node.childElementCount; index < length; index++) {
                parse(node.children[index], parentObject[node.nodeName])
            }
        } else {
            parentObject[node.nodeName] = node.innerHTML.trim()
        }
    }
}

export default parseXml
