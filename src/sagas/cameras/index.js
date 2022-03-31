import updateStreamSite from './updateStreamSite'
import fetchSites from './fetchSites'
import fetchStreamsPaginated from './fetchStreamsPaginated'
import fetchAllStreamIdsForSite from './fetchAllStreamIdsForSite'

function* camerasSaga() {
  yield updateStreamSite
  yield fetchSites
  yield fetchStreamsPaginated
  yield fetchAllStreamIdsForSite
}

export default camerasSaga
