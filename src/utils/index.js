import getUrlQueryParams from './getUrlQueryParams'
import isParentNode from './isParentNode'
import getOffsetY from './getOffsetY'
import cursorPosition from './cursorPosition'
import deepClone from './deepClone'
import stopDefaultEvent from './stopDefaultEvent'
import isIframeCrossOrigin from './isIframeCrossOrigin'
import fullScreen from './fullScreen'
import importNode from './importNode'
import importTemplate from './importTemplate'

const utils = {
	getUrlQueryParams,
	isParentNode,
	getOffsetY,
	getCursorPosition: cursorPosition.get,
	setCursorPosition: cursorPosition.set,
	deepClone,
	stopDefaultEvent,
	isIframeCrossOrigin,
	fullScreen,
	importNode,
	importTemplate
}

export default utils
