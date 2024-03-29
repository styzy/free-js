import CONSTANTS from './CONSTANTS'
import { getOffsetLeft, getOffsetTop, isParentNode, stopDefaultEvent, typeOf } from '../../utils'
import _String from '../../NativeClass/String'
import Color from '../../ExtensionClass/Color'
import './assets/stylus/index.styl'

class AutoComplateInput {
    #config = {
        suggestions: [],
        suggestionValueKey: 'value',
        suggestionZIndex: 500,
        fetchDelay: 500,
        fetchSuggestions: null,
        fetchOnFocus: false,
        matchHighLight: false,
        matchHighLightColor: '#42A5F5',
        customInputEnable: true,
        maxHeight: 270
    }
    #el_input = null
    #el = null
    #el_suggestion_list = null
    #el_loading = null
    #fetchTimer = null
    #onSelect = null
    #onCustomInputReset = null
    #isCustomInput = false
    #isShow = false
    #_hideHandler = this.#hideHandler.bind(this)
    get config() {
        return Object.assign({}, this.#config)
    }
    get el_input() {
        return this.#el_input
    }
    get onSelect() {
        return this.#onSelect
    }
    set onSelect(value) {
        if (typeOf(value) === 'Function') {
            this.#onSelect = value
        }
    }
    get onCustomInputReset() {
        return this.#onCustomInputReset
    }
    set onCustomInputReset(value) {
        if (typeOf(value) === 'Function') {
            this.#onCustomInputReset = value
        }
    }
    get size() {
        if (this.el_input) {
            return {
                width: this.el_input.offsetWidth,
                height: this.el_input.offsetHeight
            }
        }
    }
    get position() {
        if (this.el_input) {
            return {
                x: getOffsetLeft(this.el_input),
                y: getOffsetTop(this.el_input) + this.size.height
            }
        }
    }
    constructor(el_input, customOpts = {}) {
        if (typeOf(el_input) === 'String') {
            el_input = document.querySelector(el_input)
        }
        if (!typeOf(el_input).includes('Element') || el_input.tagName !== 'INPUT') {
            throw new Error(`el必须为input标签`)
        }
        this.#el_input = el_input
        this.#config = Object.assign(this.#config, customOpts)
        this.#createElement()

        this.el_input.addEventListener('focus', this.#focusHandler.bind(this))
        this.el_input.addEventListener('blur', this.#blurHandler.bind(this))
        this.el_input.addEventListener('input', this.#inputHandler.bind(this))
    }
    #createElement() {
        let el = document.createElement('div')
        el.className = CONSTANTS.CLASS_NAME.WRAPPER
        el.style.width = `${this.size.width}px`
        el.style.top = `${this.position.y}px`
        el.style.left = `${this.position.x}px`
        el.style.maxHeight = `${this.config.maxHeight}px`
        el.style.zIndex = `${this.config.suggestionZIndex}`

        let el_loading = document.createElement('div')
        el_loading.className = CONSTANTS.CLASS_NAME.LOADING
        el.appendChild(el_loading)

        let el_loading_i = document.createElement('i')
        el_loading_i.className = `${CONSTANTS.CLASS_NAME.ICONFONT} ${CONSTANTS.CLASS_NAME.ICONFONT_LOADING}`
        el_loading.appendChild(el_loading_i)

        let el_suggestion_list = document.createElement('div')
        el_suggestion_list.className = CONSTANTS.CLASS_NAME.SUGGESTION_LIST
        el.appendChild(el_suggestion_list)

        this.#el = el
        this.#el_loading = el_loading
        this.#el_suggestion_list = el_suggestion_list
    }
    #createSuggestionItem(suggestions) {
        if (!this.#el_suggestion_list) return

        suggestions.forEach((suggestion) => {
            let el_suggestion = createSuggestion.call(this, suggestion)
            if (el_suggestion) {
                this.#el_suggestion_list.appendChild(el_suggestion)
            }
        })

        function createSuggestion(suggestion) {
            let text = ''
            if (typeOf(suggestion) === 'String') {
                text = suggestion
            } else if (typeOf(suggestion) === 'Object') {
                if (suggestion.hasOwnProperty(this.config.suggestionValueKey)) {
                    text = suggestion[this.config.suggestionValueKey]
                } else {
                    console.error(`Can not find suggestionValueKey ${this.config.suggestionValueKey} in suggestion`)
                    return false
                }
            } else {
                console.error(`Suggestion type must be string or object`)
                return false
            }
            let el = document.createElement('div')
            el.className = CONSTANTS.CLASS_NAME.SUGGESTION_ITEM
            if (this.#config.matchHighLight) {
                let color = this.#config.matchHighLightColor
                if (color instanceof Color) {
                    color = color.toHex()
                }
                text = _String.replaceAll(text, this.el_input.value.toString(), `<span style="color:${color};">${this.el_input.value}</span>`)
                el.innerHTML = text
            } else {
                el.innerText = text
            }
            el.addEventListener('click', this.#selectHandler.bind(this, text, suggestion))
            return el
        }
    }
    #handleLoading(isShow) {
        if (!this.#el_loading) return
        if (isShow) {
            this.#el_loading.style.display = 'block'
        } else {
            this.#el_loading.style.display = 'none'
        }
    }
    #focusHandler(event) {
        if (this.config.fetchOnFocus) {
            this.fetch()
        }
        return stopDefaultEvent(event)
    }
    #blurHandler() {
        if (!this.config.customInputEnable && this.#isCustomInput) {
            this.el_input.value = ''
            this.onCustomInputReset && this.onCustomInputReset.call(this)
        }
    }
    #inputHandler() {
        this.#isCustomInput = true
        if (this.#fetchTimer) {
            window.clearTimeout(this.#fetchTimer)
        }
        this.#fetchTimer = window.setTimeout(() => {
            this.fetch()
            this.#fetchTimer = null
        }, this.config.fetchDelay)
    }
    #selectHandler(text, value) {
        let isPrevent = false
        if (this.onSelect) {
            isPrevent = !!this.onSelect.call(this, value)
        }
        if (isPrevent) {
            return
        }
        this.el_input.value = text
        this.#isCustomInput = false
        this.hide()
    }
    #hideHandler(event) {
        let target = event.target
        if (target === this.el_input || isParentNode(target, this.#el)) {
            return
        }
        this.hide()
    }
    #reset() {
        if (!this.#el) return
        this.#el.style.width = `${this.size.width}px`
        this.#el.style.top = `${this.position.y}px`
        this.#el.style.left = `${this.position.x}px`
        this.#el_suggestion_list.innerHTML = ''
        this.#handleLoading(true)
    }
    #show() {
        if (!this.#el || this.#isShow) return
        document.body.appendChild(this.#el)
        window.addEventListener('click', this.#_hideHandler)
        this.#isShow = true
    }
    fetch() {
        this.#reset()
        this.#show()
        if (typeOf(this.config.fetchSuggestions) === 'Function') {
            this.config.fetchSuggestions(this.el_input.value, (suggestions) => {
                this.#createSuggestionItem(suggestions)
                this.#handleLoading(false)
            })
        } else {
            this.#createSuggestionItem(this.config.suggestions)
            this.#handleLoading(false)
        }
    }
    hide() {
        if (!this.#el || !this.#isShow) return
        document.body.removeChild(this.#el)
        window.removeEventListener('click', this.#_hideHandler)
        this.#isShow = false
    }
}

export default AutoComplateInput
