// 设置光标位置
const setCursorPosition = function(element, pos) {
	var range, selection
	if (document.createRange) {
		range = document.createRange()
		range.selectNodeContents(element)
		if (element.innerHTML.length > 0) {
			range.setStart(element.childNodes[0], pos)
		}
		range.collapse(true)
		selection = window.getSelection()
		selection.removeAllRanges()
		selection.addRange(range)
	} else if (document.selection) {
		range = document.body.createTextRange()
		range.moveToElementText(element)
		range.collapse(false)
		range.select()
	}
}

export default setCursorPosition
