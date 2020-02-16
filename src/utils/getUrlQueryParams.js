import URLSearchParamsToObject from './URLSearchParamsToObject'
import getUrlSearchParams from './getUrlSearchParams'

/**
 * 以对象类型返回当前url的searchParams
 * @param {String} keyName
 */
const getUrlQueryParams = function(keyName = '') {
	let result = URLSearchParamsToObject(getUrlSearchParams())
	if (keyName) {
		return result[keyName]
	} else {
		return result
	}
}

export default getUrlQueryParams
