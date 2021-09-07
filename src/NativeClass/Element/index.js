import find from './find'
import insertAfter from './insertAfter'

class FreeElement extends Element {
    static get find() {
        return find
    }
    static get insertAfter() {
        return insertAfter
    }
    constructor(...args) {
        super(...args)
    }
    find(selector, returnNodeList) {
        return find(selector, returnNodeList, this)
    }
    insertAfter(newElement, targetElement) {
        return insertAfter(this, newElement, targetElement)
    }
}

export const extensions = {
    className: 'Element',
    methods: {
        find: FreeElement.prototype.find,
        insertAfter: FreeElement.prototype.insertAfter
    }
}

export default FreeElement
