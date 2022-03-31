// Utility for Grouping by IPs
// Transforms data from Array of Objects to { ip: [Objects, ]}
//
// https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
const arrayGroupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    const enhanced = { ...objectsByKeyValue }
    enhanced[value] = (objectsByKeyValue[value] || []).concat(obj)
    return enhanced
  }, {})

export default arrayGroupBy
