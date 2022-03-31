/* eslint-disable no-alert */
export const menuItemsWithSub = [
  {
    label: 'All sites',
    value: 'null',
  },
  {
    label: 'San Francisco',
    value: 'sf',
  },
  {
    label: 'SubMe',
    value: 'SubMe',
    subMenuItems: [
      {
        label: 'SubMe1',
        value: 'SubMe1',
      },
      {
        label: 'SubMe2',
        value: 'SubMe2',
      },
      {
        label: 'SubMe3',
        value: 'SubMe3',
      },
    ],
  },
  {
    label: 'Palo Alto',
    value: 'pa',
  },
  {
    label: 'Sub',
    value: 'sub',
    subMenuItems: [
      {
        label: 'Sub 1',
        value: 'sub1',
      },
      {
        label: 'Sub 2',
        value: 'sub2',
      },
      {
        label: 'Sub 3',
        value: 'sub3',
      },
    ],
  },
]

export const menuItems = [
  {
    label: 'All sites',
    value: 'null',
  },
  {
    label: 'San Francisco',
    value: 'sf',
  },
  {
    label: 'Palo Alto',
    value: 'pa',
  },
]

export const menuItemsWithDivider = [
  {
    label: 'All sites',
    value: 'null',
  },
  {
    divider: true,
    text: 'Preset Sites:',
  },
  {
    label: 'San Francisco',
    value: 'sf',
  },
  {
    label: 'Palo Alto',
    value: 'pa',
  },
]

export const menuItemsForDispatch = [
  {
    primary: 'Paul McCartney',
    secondary: 'Master',
    value: '1',
    img: 'https://picsum.photos/200',
  },
  {
    primary: 'John Lennon',
    secondary: 'Responder',
    value: '2',
    img: 'https://picsum.photos/201',
  },
  {
    primary: 'Ringo Starr',
    secondary: 'Operator',
    value: '3',
  },
]

export const menuItemsForDispatchVolume = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
].map(val => {
  return {
    primary: `George H${val}`,
    secondary: 'A role',
    value: val,
    img: val < 10 ? `https://picsum.photos/${val}` : null,
  }
})

export const selectOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]
