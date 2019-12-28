import CONSTANTS from './CONSTANTS'
import { getOffsetLeft, getOffsetTop, isParentNode, stopDefaultEvent } from '../../utils'
import './stylus/index.styl'

const autoComplateInput = function(opts) {
	if (!opts.el) {
		console.error('Attribute el is required')
		return false
	}
	if (typeof opts.el === 'string') {
		opts.el = document.querySelector(opts.el)
	}
	if (!opts.el) {
		console.error('Attribute el must be an HTMLElement or a valid selector')
		return false
	}

	let options = {
			el: null,
			suggestions: [],
			suggestionValueKey: 'value',
			suggestionZIndex: 500,
			fetchDelay: 500,
			fetchSuggestions: null,
			fetchOnFocus: false,
			maxHeight: 270
		},
		fetchTimer = null,
		el_suggestions = null

	options = Object.assign(options, opts)

	let size = {
		width: options.el.offsetWidth,
		height: options.el.offsetHeight
	}
	let position = {
		x: getOffsetLeft(options.el),
		y: getOffsetTop(options.el) + size.height
	}

	options.el.addEventListener('focus', focusHandler)
	options.el.addEventListener('input', inputHandler)

	function focusHandler(event) {
		if (options.fetchOnFocus) {
			fetch()
		}
		return stopDefaultEvent(event)
	}

	function inputHandler() {
		if (fetchTimer) {
			window.clearTimeout(fetchTimer)
		}
		fetchTimer = window.setTimeout(() => {
			fetch()
			fetchTimer = null
		}, options.fetchDelay)
	}

	function fetch() {
		if (typeof options.fetchSuggestions === 'function') {
			options.fetchSuggestions(options.el.value, suggestions => {
				setSuggestions(suggestions)
				showSuggestions()
			})
		} else {
			showSuggestions()
		}
	}

	function setSuggestions(suggestions) {
		options.suggestions = suggestions
	}

	function showSuggestions() {
		if (el_suggestions) {
			hideSuggestions()
		}
		el_suggestions = createSuggestionsElement({
			suggestions: options.suggestions,
			suggestionValueKey: options.suggestionValueKey,
			maxHeight: options.maxHeight,
			isPositionFixed: options.el.style.position === 'fixed',
			position,
			size,
			onFetch
		})
		if (el_suggestions) {
			document.body.appendChild(el_suggestions)
			window.addEventListener('click', hideHandler)
		}
	}

	function hideHandler(event) {
		let target = event.target
		if (target === options.el || isParentNode(target, el_suggestions)) {
			return false
		}
		hideSuggestions()
	}

	function hideSuggestions() {
		if (el_suggestions) {
			document.body.removeChild(el_suggestions)
			el_suggestions = null
			window.removeEventListener('click', hideHandler)
		}
	}

	function onFetch(value) {
		options.el.value = value
		hideSuggestions()
	}
}

function createSuggestionsElement({ suggestions, suggestionValueKey, position, size, maxHeight, isPositionFixed, onFetch }) {
	if (!suggestions.length) {
		return null
	}
	let el = document.createElement('div')
	el.className = CONSTANTS.CLASS_NAME.SUGGESTIONS_CONTAINER
	el.style.width = `${size.width}px`
	el.style.top = `${position.y}px`
	el.style.left = `${position.x}px`
	el.style.maxHeight = `${maxHeight}px`
	if (isPositionFixed) {
		el.style.position = 'fixed'
	}

	suggestions.forEach(suggestion => {
		let el_suggestion = createSuggestionElement({ suggestion, onFetch })
		if (el_suggestion) {
			el.appendChild(el_suggestion)
		}
	})

	return el

	function createSuggestionElement({ suggestion, onFetch }) {
		let text = ''
		if (typeof suggestion === 'string') {
			text = suggestion
		} else if (typeof suggestion === 'object') {
			if (suggestion.hasOwnProperty(suggestionValueKey)) {
				text = suggestion[suggestionValueKey]
			} else {
				console.error(`Can not find suggestionValueKey ${suggestionValueKey} in suggestion`)
				return false
			}
		} else {
			console.error('Suggestion`type  must be string or object')
			return false
		}
		let el = document.createElement('div')
		el.className = CONSTANTS.CLASS_NAME.SUGGESTIONS_ITEM
		el.innerText = text
		el.addEventListener('click', () => {
			onFetch(text)
		})
		return el
	}
}

export default autoComplateInput
