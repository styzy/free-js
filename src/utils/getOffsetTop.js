const getOffsetTop = function(el) {
	let offset = el.offsetTop
	if (el.offsetParent !== null) {
		offset += getOffsetTop(el.offsetParent)
	}
	return offset
}

export default getOffsetTop
