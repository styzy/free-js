import CONSTANTS from './CONSTANTS'
import { getOffsetLeft, getOffsetTop, isParentNode, stopDefaultEvent } from '../../utils'
import './stylus/index.styl'

class AutoComplateInput {
    #el = null
    #el_suggestions = null
    #fetchTimer = null
    #onSelect = null
    #config = {
        suggestions: [],
        suggestionValueKey: 'value',
        suggestionZIndex: 500,
        fetchDelay: 500,
        fetchSuggestions: null,
        fetchOnFocus: false,
        customInputEnable: true,
        maxHeight: 270
    }
    #isCustomInput = false
    #_hideHandler = this.#hideHandler.bind(this)
    get el() {
        return this.#el
    }
    get onSelect() {
        return this.#onSelect
    }
    set onSelect(value) {
        if (value instanceof Function) {
            this.#onSelect = value
        }
    }
    get config() {
        return Object.assign({}, this.#config)
    }
    get size() {
        if (this.el) {
            return {
                width: this.el.offsetWidth,
                height: this.el.offsetHeight
            }
        }
    }
    get position() {
        if (this.el) {
            return {
                x: getOffsetLeft(this.el),
                y: getOffsetTop(this.el) + this.size.height
            }
        }
    }
    constructor(el, customOpts = {}) {
        if (typeof el === 'string') {
            el = document.querySelector(el)
        }
        if (!(el instanceof HTMLElement) || el.tagName !== 'INPUT') {
            throw new Error(`el必须为input标签`)
        }
        this.#el = el
        this.#config = Object.assign(this.#config, customOpts)

        this.el.addEventListener('focus', this.#focusHandler.bind(this))
        this.el.addEventListener('blur', this.#blurHandler.bind(this))
        this.el.addEventListener('input', this.#inputHandler.bind(this))
    }
    #focusHandler(event) {
        if (this.config.fetchOnFocus) {
            this.#fetch()
        }
        return stopDefaultEvent(event)
    }
    #blurHandler() {
        if (!this.config.customInputEnable && this.#isCustomInput) {
            this.el.value = ''
        }
    }
    #inputHandler() {
        this.#isCustomInput = true
        if (this.#fetchTimer) {
            window.clearTimeout(this.#fetchTimer)
        }
        this.#fetchTimer = window.setTimeout(() => {
            this.#fetch()
            this.#fetchTimer = null
        }, this.config.fetchDelay)
    }
    #fetch() {
        if (typeof this.config.fetchSuggestions === 'function') {
            this.config.fetchSuggestions(this.el.value, suggestions => {
                this.#setSuggestions(suggestions)
                this.#showSuggestions()
            })
        } else {
            this.#showSuggestions()
        }
    }
    #setSuggestions(suggestions) {
        this.#config.suggestions = suggestions
    }
    #showSuggestions() {
        if (this.#el_suggestions) {
            this.#hideSuggestions()
        }
        this.#el_suggestions = this.#createSuggestions()
        this.#renderSuggestions()
    }
    #hideSuggestions() {
        if (this.#el_suggestions) {
            document.body.removeChild(this.#el_suggestions)
            this.#el_suggestions = null
            window.removeEventListener('click', this.#_hideHandler)
        }
    }
    #renderSuggestions() {
        if (this.#el_suggestions) {
            document.body.appendChild(this.#el_suggestions)
            window.addEventListener('click', this.#_hideHandler)
        }
    }
    #createSuggestions() {
        if (!this.config.suggestions.length) {
            return
        }
        let el = document.createElement('div')
        el.className = CONSTANTS.CLASS_NAME.SUGGESTIONS_CONTAINER
        el.style.width = `${this.size.width}px`
        el.style.top = `${this.position.y}px`
        el.style.left = `${this.position.x}px`
        el.style.maxHeight = `${this.config.maxHeight}px`
        if (this.el.style.position === 'fixed') {
            el.style.position = 'fixed'
        }

        this.config.suggestions.forEach(suggestion => {
            let el_suggestion = createSuggestion.call(this, suggestion)
            if (el_suggestion) {
                el.appendChild(el_suggestion)
            }
        })

        return el

        function createSuggestion(suggestion) {
            let text = ''
            if (typeof suggestion === 'string') {
                text = suggestion
            } else if (typeof suggestion === 'object') {
                if (suggestion.hasOwnProperty(this.config.suggestionValueKey)) {
                    text = suggestion[this.config.suggestionValueKey]
                } else {
                    console.error(`Can not find suggestionValueKey ${this.config.suggestionValueKey} in suggestion`)
                    return false
                }
            } else {
                console.error('Suggestion`type  must be string or object')
                return false
            }
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.SUGGESTIONS_ITEM
            el.innerText = text
            el.addEventListener('click', this.#selectHandler.bind(this, text))
            return el
        }
    }
    #selectHandler(value) {
        let isPrevent = false
        if (this.onSelect) {
            isPrevent = !!this.onSelect.call(this, value)
        }
        if (isPrevent) {
            return
        }
        this.el.value = value
        this.#isCustomInput = false
        this.#hideSuggestions()
    }
    #hideHandler(event) {
        let target = event.target
        if (target === this.el || isParentNode(target, this.#el_suggestions)) {
            return
        }
        this.#hideSuggestions()
    }
}

export default AutoComplateInput
