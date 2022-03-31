import map from 'lodash/map'
import partialRight from 'lodash/partialRight'
import pick from 'lodash/pick'

const pickKeyValues = (collection, keys) => {
  return map(collection, partialRight(pick, keys))
}

export default pickKeyValues
