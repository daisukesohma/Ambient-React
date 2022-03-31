import PropTypes from 'prop-types'

export const AlertInstancePropType = PropTypes.shape({
  alert: {
    site: {
      name: PropTypes.string,
      slug: PropTypes.string,
      account: {
        name: PropTypes.string,
        slug: PropTypes.string,
      },
    },
    name: PropTypes.string,
    isHard: PropTypes.bool,
  },
  stream: {
    name: PropTypes.string,
    id: PropTypes.number,
    node: {
      identifier: PropTypes.string,
    },
  },
  tsCreated: PropTypes.number,
  tsIdentifier: PropTypes.number,
  tsClipReceived: PropTypes.number,
  id: PropTypes.number,
  status: PropTypes.string,
  react_key: PropTypes.string,
  clip: PropTypes.string,
  clipS3FileName: PropTypes.string,
})

export const AlertInstancePropTypeDefault = {
  alert: {
    site: {
      name: 'Camden Yards',
      slug: 'camden-yards',
      account: {
        name: 'Orioles',
        slug: 'orioles',
      },
    },
    name: 'Game winning Homerun  detected',
    isHard: true,
  },
  stream: {
    name: 'Dugout Cam',
    id: 10,
    node: {
      identifier: '123',
    },
  },
  tsCreated: 0,
  tsIdentifier: 0,
  tsClipReceived: 0,
  id: 2,
  status: 'verified',
  react_key: '123',
  clip:
    'https://thumbs.gfycat.com/MiserlyAgitatedAfricanmolesnake-size_restricted.gif',
  clipS3FileName:
    'https://thumbs.gfycat.com/MiserlyAgitatedAfricanmolesnake-size_restricted.gif',
}
