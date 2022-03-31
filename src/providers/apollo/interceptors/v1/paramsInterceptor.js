import mapValuesDeep from 'utils/mapValuesDeep'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'

// NOTE: In future we can extend this interceptor with new versions
export default function paramsInterceptor(variables) {
  return mapValuesDeep(variables, value => {
    // NOTE: Rule 1. For GQL we need to convert all empty arrays ([]) to null to unite behavior
    if (isArray(value) && isEmpty(value)) return null
    // NOTE: Rule 2. For GQL we need to convert all empty strings ('') to null to unite behavior
    if (isString(value) && isEmpty(value)) return null
    return value
  })
}
