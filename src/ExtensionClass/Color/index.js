import CONSTANTS from './CONSTANTS'

class Color {
    #red
    #green
    #blue
    #alpha
    set red(val) {
        if (typeof val !== 'number') return
        if (val > 255) val = 255
        if (val < 0) val = 0
        this.#red = val
    }
    set green(val) {
        if (typeof val !== 'number') return
        if (val > 255) val = 255
        if (val < 0) val = 0
        this.#green = val
    }
    set blue(val) {
        if (typeof val !== 'number') return
        if (val > 255) val = 255
        if (val < 0) val = 0
        this.#blue = val
    }
    set alpha(val) {
        if (typeof val !== 'number') return
        if (val > 1) val = 1
        if (val < 0) val = 0
        this.#alpha = val
    }
    get red() {
        return this.#red
    }
    get green() {
        return this.#green
    }
    get blue() {
        return this.#blue
    }
    get alpha() {
        return this.#alpha
    }
    constructor(...args) {
        this.setColor(...args)
    }
    #setStringColor(string) {
        if (string.includes('#')) {
            this.#setHexColor(string)
        } else if (string.includes('(') || string.includes(')')) {
            this.#setRgbaStringColor(string)
        } else {
            this.#setKeywordColor(string)
        }
    }
    #setHexColor(hex) {
        hex = hex.replace(new RegExp(`#`, `gm`), ``)

        let redHex = this.#hexFormat(hex.substring(0, 2)),
            greenHex = this.#hexFormat(hex.substring(2, 4)),
            blueHex = this.#hexFormat(hex.substring(4, 6)),
            alphaHex = this.#hexFormat(hex.substring(6, 8), true)

        this.red = parseInt(redHex, 16)
        this.green = parseInt(greenHex, 16)
        this.blue = parseInt(blueHex, 16)
        this.alpha = parseInt(alphaHex, 16) / 255
    }
    #hexFormat(string, setMax) {
        if (string.length === 0) {
            return setMax ? `ff` : `00`
        } else if (string.length === 1) {
            return `${string}${setMax ? `f` : `0`}`
        } else {
            return string
        }
    }
    #setKeywordColor(keyword) {
        let color = this.#getColorByKeyword(keyword)
        if (!color) throw `未知的颜色关键字 ${keyword}`
        this.setColor(...color)
    }
    #getColorByKeyword(keyword) {
        let keywordColors = CONSTANTS.COLOR_KEYWORDS
        for (let index = 0, length = keywordColors.length; index < length; index++) {
            const color = keywordColors[index]
            if (color.KEY === keyword.toLowerCase()) {
                return color.VALUE
            }
        }
    }
    #setRgbaStringColor(string) {
        let startIndex = string.indexOf('(') + 1,
            endIndex = string.indexOf(')'),
            rgbaString = string.substring(startIndex, endIndex),
            rgbaArray = rgbaString.split(',')

        this.red = parseFloat(rgbaArray[0] || 0)
        this.green = parseFloat(rgbaArray[1] || 0)
        this.blue = parseFloat(rgbaArray[2] || 0)
        this.alpha = parseFloat(rgbaArray[3] || 1)
    }
    setColor(r = 0, g = 0, b = 0, a = 1) {
        try {
            if (typeof r === `string`) {
                this.#setStringColor(r)
            } else {
                this.red = r
                this.green = g
                this.blue = b
                this.alpha = a
            }
            return this
        } catch (error) {
            console.error('设置颜色错误：', error)
        }
    }
    setAlpha(alpha) {
        try {
            if (typeof alpha !== 'number') throw `参数必须为数字`
            this.alpha = alpha
            return this
        } catch (error) {
            console.error('设置透明度错误：', error)
        }
    }
    toRgb() {
        return `rgb(${this.red},${this.green},${this.blue})`
    }
    toRgba() {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`
    }
    toHex() {
        return `#${((1 << 24) + (this.red << 16) + (this.green << 8) + this.blue).toString(16).slice(1)}`
    }
    toAlphaHex() {
        let alphaHex = Number(Math.round(this.alpha * 255)).toString(16)
        return `${this.toHex()}${alphaHex.length === 1 ? '0' : ''}${alphaHex}`
    }
    toString(mode = CONSTANTS.MODE.HEX) {
        switch (mode) {
            case CONSTANTS.MODE.HEX:
                return this.toHex()
            case CONSTANTS.MODE.ALPHA_HEX:
                return this.toAlphaHex()
            case CONSTANTS.MODE.RGB:
                return this.toRgb()
            case CONSTANTS.MODE.RGBA:
                return this.toRgba()
            default:
                throw `错误的转换类型`
        }
    }
    add(color) {
        if (!(color instanceof Color)) {
            console.error('参数必须为color实例')
            return
        }
        this.red += color.red
        this.green += color.green
        this.blue += color.blue
        this.alpha += color.alpha
        return this
    }
    minus(color) {
        if (!(color instanceof Color)) {
            console.error('参数必须为color实例')
            return
        }
        this.red -= color.red
        this.green -= color.green
        this.blue -= color.blue
        this.alpha -= color.alpha
        return this
    }
}
export default Color
