const importTemplate = function(template) {
	if (typeof template === 'string') {
		template = document.querySelector(template)
	}

	return template.content || template.children[0]
}

export default importTemplate
