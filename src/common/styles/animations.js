const DURATION_FAST = 0.25

export const animations = {
  one: {
    initial: {
      opacity: 0,
      scale: 0.3,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        ease: 'easeInOut',
        duration: DURATION_FAST,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: {
        ease: 'easeInOut',
        duration: DURATION_FAST,
      },
    },
  },
}
