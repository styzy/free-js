const getScrollTop = function() {
	return (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollTop == 'number' ? t : document.body).scrollTop
}

export default getScrollTop
