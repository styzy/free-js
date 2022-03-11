const getCursorSelectText = function () {
	return window.getSelection
		? window.getSelection().toString()
		: document.selection.createRange().text
}

export default getCursorSelectText
