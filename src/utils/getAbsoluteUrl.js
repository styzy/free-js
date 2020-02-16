const getAbsoluteUrl = function(url) {
	let el = document.createElement('a')
	el.href = url
	return el.href
}

export default getAbsoluteUrl
