import parsePolicyJsonData from './parsePolicyJsonData'

const testData = [
  {
    id: 1,
    name: 'Day Profile',
    alerts: [
      {
        id: 1,
        name: 'Outdoor protection!',
        tagline: 'Suspicious Activity',
        tags: [
          {
            name: 'outdoor',
            description: null,
            streams: [2],
            id: 1,
          },
          {
            name: 'parking',
            description: null,
            streams: [],
            id: 3,
          },
        ],
        streams: [1],
        status: 'active',
        ts_snoozed: null,
        auto_snooze_secs: 60,
        profiles: [1],
        site: 1,
        operating_procedure: null,
      },
    ],
    times: [1, 2],
    escalation_policy: {
      levels: [
        {
          id: 74,
          contacts: [
            {
              id: 279,
              profile: {
                id: 4,
                user: {
                  id: 4,
                  username: 'paul@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'Paul',
                  last_name: 'McCartney',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'text',
            },
            {
              id: 282,
              profile: {
                id: 5,
                user: {
                  id: 5,
                  username: 'alan@ambient.ai',
                  email: 'shubham@ambient.ai',
                  first_name: 'Shubham',
                  last_name: 'Dokania',
                  is_superuser: false,
                },
                phone_number: '+918860702606',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'email',
            },
            {
              id: 286,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'email',
            },
            {
              id: 287,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'text',
            },
          ],
          level: 1,
          speech: true,
          duration_secs: 8,
        },
        {
          id: 91,
          contacts: [
            {
              id: 276,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'email',
            },
            {
              id: 277,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'text',
            },
          ],
          level: 2,
          speech: true,
          duration_secs: 7,
        },
        {
          id: 100,
          contacts: [],
          level: 3,
          speech: true,
          duration_secs: 5,
        },
        {
          id: 101,
          contacts: [],
          level: 4,
          speech: true,
          duration_secs: 5,
        },
      ],
      name: 'Daytime New',
      id: 1,
    },
    active: true,
  },
  {
    id: 2,
    name: 'Night Profile',
    alerts: [
      {
        id: 1,
        name: 'Outdoor protection!',
        tagline: 'Suspicious Activity',
        tags: [
          {
            name: 'outdoor',
            description: null,
            streams: [2],
            id: 1,
          },
          {
            name: 'parking',
            description: null,
            streams: [],
            id: 3,
          },
        ],
        streams: [1],
        status: 'active',
        ts_snoozed: null,
        auto_snooze_secs: 60,
        profiles: [1],
        site: 1,
        operating_procedure: null,
      },
    ],
    times: [1, 2],
    escalation_policy: {
      levels: [
        {
          id: 80,
          contacts: [
            {
              id: 221,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'call',
            },
            {
              id: 250,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'email',
            },
          ],
          level: 1,
          speech: true,
          duration_secs: 5,
        },
        {
          id: 81,
          contacts: [
            {
              id: 223,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'text',
            },
            {
              id: 257,
              profile: {
                id: 3,
                user: {
                  id: 3,
                  username: 'john@ambient.ai',
                  email: 'vikesh@ambient.ai',
                  first_name: 'John',
                  last_name: 'Lennon',
                  is_superuser: false,
                },
                phone_number: '+16508420326',
                role: null,
                img: '/media/img/generic_profile.jpg',
              },
              method: 'call',
            },
          ],
          level: 2,
          speech: true,
          duration_secs: 5,
        },
      ],
      name: 'Afterhours',
      id: 14,
    },
    active: true,
  },
]

it('correctly parses data into correct overall structure', () => {
  const parsedData = parsePolicyJsonData(testData)
  expect(parsedData).toBeDefined()
  expect(parsedData).toHaveProperty('contacts')
  expect(parsedData).toHaveProperty('levels')
  expect(parsedData).toHaveProperty('policies')
  expect(parsedData).toHaveProperty('policyList')
  expect(parsedData).toHaveProperty('rawInput')
  expect(parsedData.policyList).toHaveLength(2)
})

it('correctly parses contact data into correct structure', () => {
  const parsedData = parsePolicyJsonData(testData)
  expect(Object.values(parsedData.contacts).length).toEqual(6)
  const contact = Object.values(parsedData.contacts)[0]
  expect(contact).toHaveProperty('id')
  expect(contact).toHaveProperty('profile')
  expect(contact).toHaveProperty('methods')
  expect(contact).toHaveProperty('composedOf')
  expect(contact.profile).toHaveProperty('id')
  expect(contact.profile).toHaveProperty('user')
  expect(contact.profile).toHaveProperty('phone_number')
  expect(contact.profile).toHaveProperty('role')
  expect(contact.profile).toHaveProperty('img')
  expect(contact.profile.user).toHaveProperty('id')
  expect(contact.profile.user).toHaveProperty('username')
  expect(contact.profile.user).toHaveProperty('email')
  expect(contact.profile.user).toHaveProperty('first_name')
  expect(contact.profile.user).toHaveProperty('last_name')
  expect(contact.profile.user).toHaveProperty('is_superuser')
})

it('correctly parses level data into correct structure', () => {
  const parsedData = parsePolicyJsonData(testData)
  expect(Object.values(parsedData.levels).length).toEqual(6)
  const level = Object.values(parsedData.levels)[0]
  expect(level).toHaveProperty('id')
  expect(level).toHaveProperty('contacts')
  expect(level).toHaveProperty('level')
  expect(level).toHaveProperty('speech')
  expect(level).toHaveProperty('duration_secs')
  expect(level).toHaveProperty('policy')
  expect(level).toHaveProperty('escalationContactIds')
  expect(level).toHaveProperty('isCreating')
  expect(level).toHaveProperty('users')
})

it('correctly parses policy data into correct structure', () => {
  const parsedData = parsePolicyJsonData(testData)
  expect(Object.values(parsedData.policies).length).toEqual(2)
  const policy = Object.values(parsedData.policies)[0]
  expect(policy).toHaveProperty('id')
  expect(policy).toHaveProperty('name')
  expect(policy).toHaveProperty('levels')
  expect(policy).toHaveProperty('profile_id')
  expect(policy).toHaveProperty('escalation_policy_id')
})
