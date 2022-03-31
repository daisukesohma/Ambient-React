// values is an array of value objects
// If there are no values, React-Select removes MultiValueContainer from the DOM
// ie. [{label: "car", value: 2, idx: 1, color: "#0ABFFC", type: "entity"}, ...]
//
export const _concatMultiLabels = values => {
  if (values.length === 1) {
    // if just one, return it
    return values[0].label
  }

  return _concatLabels(_reorderLabels(values))
}

// order by property first, then entity, ie. "red car" instead of "car red"
// it accepts an array and returns a sorted array
//
export const _reorderLabels = values => {
  return values.sort((a, b) => {
    if (a.type === 'property' || a.type === 'state') {
      return -1
    }
    if (b.type === 'property' || b.type === 'state') {
      return 1
    }
    return 0
  })
}

// values is array of value objects
// ie. [{label: "car", value: 2, idx: 1, color: "#0ABFFC", type: "entity"}, ...]
export const _concatLabels = values => {
  return values.map(v => v.label.toLowerCase()).join(' ')
}
