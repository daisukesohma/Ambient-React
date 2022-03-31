export const InfoBoxTypeEnum = Object.freeze({
  TIMEZONE_SUPPORT: 'TIMEZONE_SUPPORT',
})

const InfoBoxContentEnum = Object.freeze({
  [InfoBoxTypeEnum.TIMEZONE_SUPPORT]:
    'If a single site is selected, the timestamp will be based on the site timezone. If multiple sites are selected, it will follow your current local timezone.',
})

export default InfoBoxContentEnum
