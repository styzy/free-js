import _Element, { extensions as ElementExtensions } from './Element'
import _String, { extensions as StringExtensions } from './String'
import _Date, { extensions as DateExtensions } from './Date'

export const nativeClassExtensions = [ElementExtensions, StringExtensions, DateExtensions]

export default {
    Element: _Element,
    String: _String,
    Date: _Date
}
