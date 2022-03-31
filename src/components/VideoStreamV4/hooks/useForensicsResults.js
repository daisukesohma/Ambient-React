import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { fetchResultsRequested } from '../../../redux/slices/videoStreamControls'

const useForensicsResults = ({
  accountSlug,
  siteSlug,
  videoStreamKey,
  streamId,
}) => {
  const dispatch = useDispatch()

  return useCallback(
    ({
      startTs,
      endTs,
      query,
      // regionIds,
      limit = 24,
      page = 1,
    }) => {
      dispatch(
        fetchResultsRequested({
          videoStreamKey,
          params: {
            accountSlug,
            siteSlug,
            startTs,
            endTs,
            streamIds: [streamId],
            query, //  QueryInput!
            limit, //  Int
            page, //  Int
          },
        }),
      )
    },
    [accountSlug, dispatch, siteSlug, streamId, videoStreamKey],
  )
}

export default useForensicsResults
