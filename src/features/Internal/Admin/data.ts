export interface DataTypes {
  name: string
  link: string
  desc: string
}

const data = [
  {
    name: 'Data Infrastructure',
    link: '/internal/data-infrastructure',
    desc:
      'Create and manage campaigns for signature performance, and view data points.',
  },
  {
    name: 'Annotation',
    link: '/internal/data-infrastructure/annotate',
    desc: 'Annotate failure modes on false alerts.',
  },
  {
    name: 'Verification Portal',
    link: '/internal/verification-portal',
    desc: 'Ambient SOC portal for alert verification',
  },
]

export default data
