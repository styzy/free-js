import { findDom } from '../utils'

const methods = {
    find,
    insertAfter
}

function find(selector, returnNodeList) {
    return findDom(selector, returnNodeList, this)
}

function insertAfter(newElement, targetElement) {
    if (targetElement.parentNode !== this) {
        throw new DOMException(`Failed to execute 'insertAfter' on 'Node': The node after which the new node is to be inserted is not a child of this node.`)
    }
    if (this.lastChild === targetElement) {
        this.appendChild(newElement)
    } else {
        this.insertBefore(newElement, targetElement.nextSibling)
    }
}

export default methods
