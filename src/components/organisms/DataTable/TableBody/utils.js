export const desc = (a, b, orderBy, values) => {
  if (values && values[orderBy]) {
    if (b[orderBy][values[orderBy]] < a[orderBy][values[orderBy]]) {
      return -1
    }
    if (b[orderBy][values[orderBy]] > a[orderBy][values[orderBy]]) {
      return 1
    }
    return 0
  }
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

export const getSorting = (order, orderBy, values) => {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy, values)
    : (a, b) => -desc(a, b, orderBy, values)
}
