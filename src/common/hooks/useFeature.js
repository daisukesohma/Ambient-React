import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import some from 'lodash/some'

import getFeatures from '../../selectors/auth/getFeatures'

export default function useFeature({ accountSlug, feature }) {
  const features = useSelector(getFeatures({ accountSlug }))
  return useMemo(() => some(features, { feature }), [features, feature])
}
