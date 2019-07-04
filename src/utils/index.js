import getUrlQueryParams from './getUrlQueryParams'
import isParentNode from './isParentNode'
import getOffsetY from './getOffsetY'
import cursorPosition from './cursorPosition'
import deepClone from './deepClone'
import stopDefaultEvent from './stopDefaultEvent'

const utils = {
    getUrlQueryParams,
    isParentNode,
    getOffsetY,
    getCursorPosition: cursorPosition.get,
    setCursorPosition: cursorPosition.set,
    deepClone,
    stopDefaultEvent
}

export default utils