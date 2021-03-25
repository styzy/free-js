import CONSTANTS from './CONSTANTS'
import { getScrollTop, getScrollLeft } from '../../utils'
import './assets/stylus/index.styl'

class Tip {
    #config = {
        anchor: CONSTANTS.ANCHOR.TOP_LEFT,
        minWidth: 50,
        maxWidth: 400,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.6)',
        animateDuration: 300,
        showOnHover: true,
        zIndex: 999
    }
    #el = null
    #el_tip = null
    #el_content = null
    get config() {
        return Object.assign({}, this.#config)
    }
    set content(content) {
        if (!this.#el_content) return

        this.#el_content.innerHTML = ''

        if (content instanceof Function) {
            content = content()
        }

        if (typeof content === 'string') {
            this.#el_content.innerHTML = content
        }

        if (content instanceof HTMLElement) {
            this.#el_content.appendChild(content)
        }
    }
    constructor(el, content = '', customOpts = {}) {
        if (typeof el === 'string') {
            el = document.querySelector(el)
        }

        this.#el = el
        this.#config = Object.assign(this.#config, customOpts)

        this.#render()

        this.content = content

        if (this.config.showOnHover) {
            this.#bindHoverHandler()
        }

        this.#windowResizeFix()
    }
    #windowResizeFix() {
        if (this.#el.style.position === 'fixed') {
            window.addEventListener('resize', () => {
                this.#render()
            })
        }
    }
    #bindHoverHandler() {
        this.#el.addEventListener('mouseenter', () => {
            this.show()
        })
        this.#el.addEventListener('mouseleave', () => {
            this.hide()
        })
    }
    #render() {
        const el_ctn = document.createElement('div'),
            el_wrap = document.createElement('div'),
            el_angle = document.createElement('div'),
            el_contentCtn = document.createElement('div')

        el_ctn.className = CONSTANTS.CLASS_NAME.CONTAINER
        el_ctn.style.minWidth = `${this.config.minWidth}px`
        el_ctn.style.maxWidth = `${this.config.maxWidth}px`
        el_ctn.style.zIndex = this.config.zIndex
        el_ctn.style.animationDuration = `${this.config.animateDuration / 1000}s`
        if (this.#el.style.position === 'fixed') {
            el_ctn.style.position = 'fixed'
        }

        el_wrap.className = CONSTANTS.CLASS_NAME.WRAPPER
        el_wrap.style.backgroundColor = this.config.backgroundColor
        el_wrap.style.color = this.config.color

        el_angle.className = CONSTANTS.CLASS_NAME.ANGLE
        el_angle.style.borderColor = this.config.backgroundColor

        el_contentCtn.className = CONSTANTS.CLASS_NAME.CONTENT

        const offset = this.#getOffset()

        switch (this.config.anchor) {
            default:
            case CONSTANTS.ANCHOR.TOP_LEFT:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_TOP_LEFT}`
                el_ctn.style.bottom = `calc(100% - ${offset.top}px)`
                el_ctn.style.left = `${offset.left}px`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_TOP_LEFT}`
                break
            case CONSTANTS.ANCHOR.TOP_RIGHT:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_TOP_RIGHT}`
                el_ctn.style.bottom = `calc(100% - ${offset.top}px)`
                el_ctn.style.right = `calc(100% - ${offset.right}px)`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_TOP_RIGHT}`
                break
            case CONSTANTS.ANCHOR.BOTTOM_LEFT:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_BOTTOM_LEFT}`
                el_ctn.style.top = `${offset.bottom}px`
                el_ctn.style.left = `${offset.left}px`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_BOTTOM_LEFT}`
                break
            case CONSTANTS.ANCHOR.BOTTOM_RIGHT:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_BOTTOM_RIGHT}`
                el_ctn.style.top = `${offset.bottom}px`
                el_ctn.style.right = `calc(100% - ${offset.right}px)`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_BOTTOM_RIGHT}`
                break
            case CONSTANTS.ANCHOR.LEFT_TOP:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_LEFT_TOP}`
                el_ctn.style.top = `${offset.top}px`
                el_ctn.style.right = `calc(100% - ${offset.left}px)`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_LEFT_TOP}`
                break
            case CONSTANTS.ANCHOR.LEFT_BOTTOM:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_LEFT_BOTTOM}`
                el_ctn.style.bottom = `calc(100% - ${offset.bottom}px)`
                el_ctn.style.right = `calc(100% - ${offset.left}px)`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_LEFT_BOTTOM}`
                break
            case CONSTANTS.ANCHOR.RIGHT_TOP:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_RIGHT_TOP}`
                el_ctn.style.top = `${offset.top}px`
                el_ctn.style.left = `${offset.right}px`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_RIGHT_TOP}`
                break
            case CONSTANTS.ANCHOR.RIGHT_BOTTOM:
                el_ctn.className += ` ${CONSTANTS.CLASS_NAME.CONTAINER_RIGHT_BOTTOM}`
                el_ctn.style.bottom = `calc(100% - ${offset.bottom}px)`
                el_ctn.style.left = `${offset.right}px`
                el_angle.className += ` ${CONSTANTS.CLASS_NAME.ANGLE_RIGHT_BOTTOM}`
                break
        }

        el_wrap.appendChild(el_contentCtn)
        el_wrap.appendChild(el_angle)
        el_ctn.appendChild(el_wrap)

        this.#el_tip = el_ctn
        this.#el_content = el_contentCtn
    }
    #getOffset() {
        let { top, bottom, left, right } = this.#el.getBoundingClientRect(),
            scrollTop = getScrollTop(),
            scrollLeft = getScrollLeft()

        if (this.#el.style.position === 'fixed') {
            scrollTop = 0
            scrollLeft = 0
        }

        top += scrollTop
        bottom += scrollTop
        left += scrollLeft
        right += scrollLeft

        return {
            top,
            bottom,
            left,
            right
        }
    }
    show() {
        this.#el_tip && document.body.appendChild(this.#el_tip)
    }
    hide() {
        try {
            document.body.removeChild(this.#el_tip)
        } catch (error) {}
    }
}

export default Tip
