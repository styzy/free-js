const loadCss = function (url, { error = null, load = null, rel = 'stylesheet', media = '', sizes = '', type = '' } = {}) {
    let link = document.createElement('link')
    link.href = url
    link.onerror = error
    link.onload = load
    link.rel = rel
    if (media) link.media = media
    if (sizes) link.sizes = sizes
    document.head.appendChild(link)
}

export default loadCss
