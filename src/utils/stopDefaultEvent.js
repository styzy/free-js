const stopDefaultEvent = function(event) {
    event = event || window.event
    if (!event) {
        return false
    }

    if (event.stopPropagation) {
        event.stopPropagation()
    }
    if (event.preventDefault) {
        event.preventDefault()
    }

    if (window.event) {
        window.event.returnValue == false;
    }

    return false
}

export default stopDefaultEvent