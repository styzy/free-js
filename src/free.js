import Free from './index'

if (!window.free) {
    window.free = new Free()
} else {
    console.warn('free-js无法使用，free关键字占用')
}