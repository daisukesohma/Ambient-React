export interface CreateAlertErrorReportRequestedActionType {
  payload: {
    reason: string
    description: string | null
  }
}

export interface SubmitAlertModalSliceType {
  submitAlertModal: {
    error: string | null
    alertId: string | null
    streamId: string | null
    profileId: string | null
    reason: string
    description: string
    loading: boolean
    modalOpen: boolean
    siteSlug: string | null
    threatSignatureId: string | null
    threatSignatureName: string | null
    streamName: string | null
  }
}
