export const menuItemsForOptionMenu = [
  {
    label: 'Escalate',
    value: 'escalate',
    onClick: () => {
      alert('escalate')
    },
    hoverColor: 'red',
  },
  {
    label: 'Skip',
    value: 'skip',
    onClick: () => {
      alert('skip')
    },
  },
  {
    label: 'Go',
    value: 'go',
    onClick: () => {
      alert('go')
    },
  },
]

export const menuItemsWithDividerForOptionMenu = [
  {
    label: 'Escalate',
    value: 'escalate',
    onClick: () => {
      alert('escalate')
    },
  },
  {
    divider: true,
    text: 'Preset of actions:',
  },
  {
    label: 'Skip',
    value: 'skip',
    onClick: () => {
      alert('skip')
    },
  },
  {
    label: 'Go',
    value: 'go',
    onClick: () => {
      alert('go')
    },
  },
]
