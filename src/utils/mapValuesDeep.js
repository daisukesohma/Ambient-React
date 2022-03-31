import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import mapValues from 'lodash/mapValues'

const mapValuesDeep = (value, callback) => {
  if (isArray(value) && !isEmpty(value))
    return value.map(innerObj => mapValuesDeep(innerObj, callback))
  if (isObject(value) && !isEmpty(value))
    return mapValues(value, val => mapValuesDeep(val, callback))
  return callback(value)
}

export default mapValuesDeep
