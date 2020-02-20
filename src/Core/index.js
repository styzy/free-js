import { version, buildTime, githubUrl } from '../config'

class Core {
	constructor(devMode) {
		let free = get
		free.utils = {}
		free.devMode = devMode
		free.version = version
		free.buildTime = buildTime
		free.githubUrl = githubUrl
		return free
	}
}

function get(selector = '', isAll = false) {
	if (isAll) {
		return document.querySelectorAll(selector)
	} else {
		return document.querySelector(selector)
	}
}

export default Core
