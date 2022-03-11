const setCursorSelectTag = function (el) {
	if (document.body.createTextRange) {
		let range = document.body.createTextRange()

		range.moveToElementText(el)
		range.select()
	} else if (window.getSelection) {
		let selection = window.getSelection(),
			range = document.createRange()
		range.selectNodeContents(el)
		selection.removeAllRanges()
		selection.addRange(range)
	}
}

export default setCursorSelectTag
