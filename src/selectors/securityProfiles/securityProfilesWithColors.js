import { createSelector } from '@reduxjs/toolkit'

const staticColors = [
  'hsl(322,36%,72%)',
  'hsl(90,63%,42%)',
  'hsl(288,55%,75%)',
  'hsl(272,57%,12%)',
  'hsl(223,45%,64%)',
  'hsl(174,70%,55%)',
  'hsl(171,32%,70%)',
  'hsl(65,51%,75%)',
  'hsl(348,85%,75%)',
  'hsl(317,88%,57%)',
  'hsl(228,62%,54%)',
  'hsl(302,49%,20%)',
  'hsl(11,34%,35%)',
  'hsl(298,49%,39%)',
  'hsl(226,45%,38%)',
  'hsl(1,62%,63%)',
  'hsl(199,33%,61%)',
  'hsl(324,59%,57%)',
  'hsl(154,53%,27%)',
  'hsl(86,91%,54%)',
]

export default createSelector(
  [state => state.threatEscalation.securityProfiles],
  securityProfiles =>
    securityProfiles.map((securityProfile, index) => ({
      event: securityProfile.name,
      color: staticColors[index % 20],
      id: securityProfile.id,
    })),
)
