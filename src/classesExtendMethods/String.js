const methods = {
    replaceAll
}

function replaceAll(toReplaceString, targetReplaceString) {
    targetReplaceString = targetReplaceString || ''
    return this.replace(new RegExp(toReplaceString, "gm"), targetReplaceString);
}

export default methods