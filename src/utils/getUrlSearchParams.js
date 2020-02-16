import getAbsoluteUrl from './getAbsoluteUrl'
/**
 * 获取url的searchParams的对象类型值
 * @param {String} url
 */
const getUrlSearchParams = function(url = window.location.href) {
	url = getAbsoluteUrl(url)
	return new URLSearchParams(new URL(url).search)
}

export default getUrlSearchParams
