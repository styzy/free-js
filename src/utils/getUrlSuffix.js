const getUrlSuffix = (url) => {
    return url.split('.')[url.split('.').length - 1] || ''
}

export default getUrlSuffix
