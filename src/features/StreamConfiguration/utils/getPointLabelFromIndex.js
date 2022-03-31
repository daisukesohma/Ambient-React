const getPointLabelFromIndex = i => {
  switch (i) {
    case 0:
      return 'Top Left (TL)'
    case 1:
      return 'Top Right (TR)'
    case 2:
      return 'Bottom Right (BR)'
    case 3:
      return 'Bottom Left (BL)'
    default:
      return 'none'
  }
}

export default getPointLabelFromIndex
