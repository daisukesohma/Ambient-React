import PropTypes from 'prop-types'

export const SitePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
})

export const SitePropTypeDefault = {
  id: '1',
  name: 'SF',
  slug: 'sf',
}

//
// export default {
//   type: SitePropType,
//   value: SitePropTypeDefault
// }
