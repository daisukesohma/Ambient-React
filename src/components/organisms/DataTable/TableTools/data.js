export const defaultPaginationOptions = [10, 25, 100]

export const generateItems = options => {
  return options.map(option => ({
    label: option,
    value: option,
  }))
}
