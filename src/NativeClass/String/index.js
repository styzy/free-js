import replaceAll from './replaceAll'

class FreeString extends String {
    static get replaceAll() {
        return replaceAll
    }
    constructor(...args) {
        super(...args)
    }
    replaceAll(toReplaceString, targetReplaceString) {
        return replaceAll(this, toReplaceString, targetReplaceString)
    }
}

export const extensions = {
    className: 'String',
    methods: {
        replaceAll: FreeString.prototype.replaceAll
    }
}

export default FreeString
