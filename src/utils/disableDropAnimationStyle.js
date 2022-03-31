export default (style, isDragging, isDropAnimating) => {
  if (!isDragging) return {}
  if (!isDropAnimating) return style
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  }
}
