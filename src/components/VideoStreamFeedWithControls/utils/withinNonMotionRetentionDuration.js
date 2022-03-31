import { getCurrUnixTimestamp } from '../../../utils'

const withinNonMotionRetentionDuration = (
  unixTs,
  nonmotionSegmentRetentionDays,
) => {
  const nonmotionSegmentRetentionDuration =
    nonmotionSegmentRetentionDays * 86400
  return nonmotionSegmentRetentionDays > 0
    ? getCurrUnixTimestamp() - nonmotionSegmentRetentionDuration <= unixTs
    : false
}
export default withinNonMotionRetentionDuration
