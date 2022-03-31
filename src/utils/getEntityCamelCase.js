// takes an entity v1 query array and outputs a camelcase string
// usage:
// getEntityCamelCase(['entity_person', 'interaction_carrying']) => 'personCarrying'
//
const getEntityCamelCase = queryStringArray => {
  const intermediate = queryStringArray
    .map(q => q.replace('entity_', ''))
    .map(q => q.replace('interaction_', ''))
    .map((q, i) => {
      if (i > 0) {
        return q.charAt(0).toUpperCase() + q.slice(1)
      }
      return q
    })
  return intermediate.join('')
}

export default getEntityCamelCase
