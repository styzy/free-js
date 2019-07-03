import getUrlQueryParams from './getUrlQueryParams'
import isParentNode from './isParentNode'
import getOffsetY from './getOffsetY'
import cursorPosition from './cursorPosition'

const utils = {
    getUrlQueryParams,
    isParentNode,
    getOffsetY,
    getCursorPosition: cursorPosition.get,
    setCursorPosition: cursorPosition.set
}

export default utils