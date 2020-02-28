const importTemplate = function(template) {
	if (typeof template === 'string') {
		template = document.querySelector(template)
	}

	if (template.content) {
		template = template.content
	}

	return template.children[0]
}

export default importTemplate
