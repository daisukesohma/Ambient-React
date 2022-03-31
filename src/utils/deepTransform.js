import transform from 'lodash/transform'
import isObject from 'lodash/isObject'

export default function deepTransform(object, transformer) {
  return transform(object, (result, value, key) => {
    const _value = transformer(value, key)
    result[key] = isObject(_value) ? deepTransform(_value, transformer) : _value
  })
}
