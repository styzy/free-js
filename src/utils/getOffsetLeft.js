const getOffsetLeft = function(el) {
	let offset = el.offsetLeft
	if (el.offsetParent !== null) {
		offset += getOffsetLeft(el.offsetParent)
	}
	return offset
}

export default getOffsetLeft
