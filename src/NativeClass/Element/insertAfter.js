const insertAfter = function (parentElement, newElement, targetElement) {
    if (targetElement.parentNode !== parentElement) {
        throw new DOMException(`Failed to execute 'insertAfter' on 'Node': The node after which the new node is to be inserted is not a child of this node.`)
    }
    if (parentElement.lastChild === targetElement) {
        parentElement.appendChild(newElement)
    } else {
        parentElement.insertBefore(newElement, targetElement.nextSibling)
    }
}

export default insertAfter
