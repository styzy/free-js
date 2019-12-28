const getScrollLeft = function() {
	return (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft
}

export default getScrollLeft
