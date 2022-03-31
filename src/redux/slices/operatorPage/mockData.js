export const TEST_SITE = {
  id: 13,
  name: '100Streams',
  slug: '100Streams',
}

export const TEST_STREAM = {
  id: 289,
  name: 'modified',
  node: {
    identifier: '100Streams',
    site: {
      id: 'U2l0ZU5vZGU6MTM=',
      name: '100Streams',
      slug: '100Streams',
    },
  },
  active: true,
}

export const TEST_STREAM_FEED = {
  id: '270',
  orderIndex: 0,
  streamId: 292,
  stream: {
    id: 292,
    name: '/root/ambient/media/100Streams-1.mp4',
  },
}

export const TEST_VIDEO_WALL = {
  id: '167',
  name: 'Operator Video Wall Dung Van1 - acme',
  public: false,
  owner: {
    user: {
      id: 157,
      username: 'dung@ambient.ai',
      firstName: 'Dung',
      lastName: 'Van1',
    },
  },
  streamFeeds: [TEST_STREAM_FEED],
  template: {
    id: 5,
    name: 'Sixteen Streams',
  },
}

export const TEST_USER = {
  id: 1,
  firstName: 'Vikesh',
  lastName: 'Khanna',
  email: 'vikesh@ambient.ai',
  username: 'vikesh',
  isActive: true,
  profile: {
    id: 1,
    phoneNumber: '+16508420326',
    countryCode: '+1',
    isoCode: null,
    img: null,
    isSignedIn: false,
    isNewUser: true,
    role: {
      id: '2',
      name: 'Administrator (STRING)',
      role: 'Administrator',
    },
    sites: {
      edges: [
        {
          node: {
            gid: 36,
            name: 'host8',
            slug: 'host8',
            account: {
              slug: 'acme',
            },
          },
        },
      ],
    },
    federationProfiles: [],
  },
}

export const TEST_TEMPLATE = {
  id: 4,
  name: '4,1x3',
  description: 'Five streams',
  shape: [[0, 0, 12, 12]],
}
