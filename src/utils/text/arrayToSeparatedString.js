const arrayToSeparatedString = (
  strings,
  separator = ',',
  finalSeparator = 'and',
) => {
  const { length } = strings
  return strings
    .map((s, i) => {
      if (length === 1) {
        return s
      }

      const useSeparator = i < length - 2
      const useFinalSeparator = i === length - 2
      return `${s}${useSeparator ? separator : ''}${
        useFinalSeparator ? ` ${finalSeparator}` : ''
      }`
    })
    .join(' ')
}

export default arrayToSeparatedString
