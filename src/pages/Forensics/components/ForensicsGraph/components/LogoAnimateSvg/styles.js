import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  logo: ({ size, x, y }) => ({
    width: size,
    opacity: 0.7,
    transform: 'rotate(0deg)',
    transformOrigin: `${x}px ${y}px`,
    transitionTimingFunction: 'ease-out',
    transition: 'opacity .25s, transform .25s',
    '&.hasHovered': {
      opacity: 0.4,
      transform: 'rotate(60deg)',
    },
    '&.hasActive': {
      opacity: 0.4,
      transform: 'rotate(120deg)',
    },
    '&.hasHovered.hasActive': {
      opacity: 0.4,
      transform: 'rotate(180deg)',
    },
  }),
}))
