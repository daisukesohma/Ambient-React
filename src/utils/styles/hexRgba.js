import hexRgb from 'hex-rgb'

// converts hex and alpha  into an rgba string
const hexRgba = (hex, alpha = 1) => {
  if (hex) {
    const rgb = hexRgb(hex)
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha})`
  }
  return null
}

export default hexRgba
