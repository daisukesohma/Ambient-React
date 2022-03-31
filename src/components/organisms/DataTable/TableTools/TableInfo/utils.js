const getTotal = (totalCountOverride, total, filtered) => {
  if (totalCountOverride) return totalCountOverride
  if (filtered < total) {
    return filtered
  }

  return total
}

const getInfo = ({ data, rows, page, rowsPerPage, totalCountOverride }) => {
  const total = data.length // ie. 100
  const filtered = rows.length // ie. 16
  const start = rowsPerPage * page + 1 // ie. 1

  // util functions
  const getEnd = () => {
    const theoreticalEnd = start + rowsPerPage - 1 // ie. 25

    // FUTURE @Eric Make this function more readable
    // And supports filter values when totalCountOverride too
    // if total count override, use it
    if (totalCountOverride) {
      if (theoreticalEnd < totalCountOverride) {
        return theoreticalEnd
      }
      return totalCountOverride
    }

    // prevents ' Showing 1-25 of 16'
    if (theoreticalEnd < filtered) {
      return theoreticalEnd
    }

    // prevents ' Showing 1-25 of 16'
    if (filtered < total) {
      return filtered
    }

    // prevents ' Showing 1-25 of 20'
    if (total < theoreticalEnd) {
      return total
    }

    return theoreticalEnd
  }

  // prevents "Showing 1-0 of 0"
  if (getTotal() === 0) {
    return 'No results'
  }

  // TODO: FIX THIS. not changing value when updating site.
  // console.log('getInfo data', data, getTotal(total), total)

  return `Showing ${start}-${getEnd()} of ${getTotal(
    totalCountOverride,
    total,
    filtered,
  )}`
}

export { getInfo }
