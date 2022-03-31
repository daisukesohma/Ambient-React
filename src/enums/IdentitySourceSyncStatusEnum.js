// TODO: @rodaan - fix the backend endpoint of IdentitySource sync status so statuses conrrespond
// to the standard statuses of NodeRequestStatusEnum
// be similar to the NodeRequestStatus endpoint so we can consolidate this enum
// with the NodeRequestStatusEnum
//
const IdentitySourceSyncStatusEnum = Object.freeze({
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
})

export default IdentitySourceSyncStatusEnum
