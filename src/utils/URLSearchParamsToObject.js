/**
 * URLSearchParams转换Object
 * @param {URLSearchParams} searchParams
 */
const URLSearchParamsToObject = function(searchParams) {
	if (searchParams instanceof URLSearchParams) {
		return Object.fromEntries(searchParams)
	}
}

export default URLSearchParamsToObject
