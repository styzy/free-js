import { typeOf } from '../../utils'

const replaceAll = function (originString, toReplaceString, targetReplaceString) {
    targetReplaceString = targetReplaceString || ''
    if (typeOf(originString) !== 'String' || typeOf(toReplaceString) !== 'String' || typeOf(targetReplaceString) !== 'String') {
        throw new Error('replaceAllString params must be String type.')
    }
    return originString.replace(new RegExp(toReplaceString, 'gm'), targetReplaceString)
}

export default replaceAll
