import format from './format'

class FreeDate extends Date {
    static get format() {
        return format
    }
    constructor(...args) {
        super(...args)
    }
    format(rules) {
        return format(this, rules)
    }
}

export const extensions = {
    className: 'Date',
    methods: {
        format: FreeDate.prototype.format
    }
}

export default FreeDate
