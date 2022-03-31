import reducer, {
  toggleSlider,
  updateTabValue,
  setFailureModeFilterAtLeastOne,
  fetchAllThreatSignaturesRequested,
  fetchAllThreatSignaturesFailed,
} from './dataInfraSlice'

describe('Data Infra Reducer', () => {
  it('should handle toggleSlider', () => {
    expect(
      reducer(
        {},
        {
          type: toggleSlider,
          payload: {},
        },
      ),
    ).toEqual({
      campaignSwitch: true,
      campaignCurrentPage: 1,
    })
  })

  it('should handle updateTabValue', () => {
    expect(
      reducer(
        {},
        {
          type: updateTabValue,
          payload: {
            tabValue: 0,
          },
        },
      ),
    ).toEqual({
      tabValue: 0,
    })
  })

  it('should handle setFailureModeFilterAtLeastOne', () => {
    expect(
      reducer(
        {},
        {
          type: setFailureModeFilterAtLeastOne,
          payload: {
            failureModeFilterAtLeastOne: true,
          },
        },
      ),
    ).toEqual({
      failureModeFilterAtLeastOne: true,
    })
  })

  it('should handle fetchAllThreatSignaturesRequested', () => {
    expect(
      reducer(
        {},
        {
          type: fetchAllThreatSignaturesRequested,
          payload: {},
        },
      ),
    ).toEqual({
      threatSignatureLoading: true,
    })
  })

  it('should handle fetchAllThreatSignaturesFailed', () => {
    expect(
      reducer(
        {},
        {
          type: fetchAllThreatSignaturesFailed,
          payload: {},
        },
      ),
    ).toEqual({
      threatSignatureLoading: false,
    })
  })
})
