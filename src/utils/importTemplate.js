const importTemplate = function(template) {
	if (typeof template === 'string') {
		template = document.querySelector(template)
	}

	return template.content || template
}

export default importTemplate
