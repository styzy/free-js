import Core from './Core'
import ajax from './ajax'
import utils from './utils'
import Log from './Log'
import classesExtendMethdos from './classesExtendMethods'
import logo from './logo'

const Free = function(devMode) {
	let core = new Core(!!devMode)

	core.utils = utils
	core.ajax = ajax
	core.Log = () => {
		return new Log({ devMode: core.devMode })
	}
	core.awesome = () => {
		return applyClassesExtendMethdos.call(core, classesExtendMethdos)
	}
	core.devMode && logo(core)
	return core
}

function applyClassesExtendMethdos(classesExtendMethdos) {
	for (const className in classesExtendMethdos) {
		if (classesExtendMethdos.hasOwnProperty(className)) {
			if (window[className]) {
				for (const methodName in classesExtendMethdos[className]) {
					if (classesExtendMethdos[className].hasOwnProperty(methodName)) {
						const method = classesExtendMethdos[className][methodName]
						window[className].prototype[methodName] = method
					}
				}
			}
		}
	}
	return 'owesome'
}

export { Free }

export default Free
