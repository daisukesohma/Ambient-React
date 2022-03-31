import reducer, { initialState } from './reducer'
// import { TOGGLE_EDGES } from './actionTypes'

describe('threatSignatureAlerts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  // it('should handle TOGGLE_EDGES', () => {
  //   expect(
  //     reducer(
  //       {
  //         active: null,
  //         autocompleteFlat: true,
  //         autocompleteLoading: false,
  //         autocompleteTerms: [], // List of next terms you can type
  //         autocompleteThreatSignature: null, // If threat signature is "completed", this stores that object.
  //         collection: [],
  //         createAlertOpen: false,
  //         createDefaultAlertOpen: false,
  //         createLoading: false,
  //         defaultAlerts: [],
  //         deleteLoading: false,
  //         detailed: null,
  //         editLoading: false,
  //         error: null,
  //         hovered: null,
  //         loading: false,
  //         search: '',
  //         siteSlug: null,
  //         showEdges: true,
  //       },
  //       {
  //         type: TOGGLE_EDGES,
  //       },
  //     ),
  //   ).toEqual({
  //     active: null,
  //     autocompleteFlat: true,
  //     autocompleteLoading: false,
  //     autocompleteTerms: [], // List of next terms you can type
  //     autocompleteThreatSignature: null, // If threat signature is "completed", this stores that object.
  //     collection: [],
  //     createAlertOpen: false,
  //     createDefaultAlertOpen: false,
  //     createLoading: false,
  //     defaultAlerts: [],
  //     deleteLoading: false,
  //     detailed: null,
  //     editLoading: false,
  //     error: null,
  //     hovered: null,
  //     loading: false,
  //     search: '',
  //     siteSlug: null,
  //     showEdges: false,
  //   })
  //   expect(
  //     reducer(
  //       {
  //         active: null,
  //         autocompleteFlat: true,
  //         autocompleteLoading: false,
  //         autocompleteTerms: [], // List of next terms you can type
  //         autocompleteThreatSignature: null, // If threat signature is "completed", this stores that object.
  //         collection: [],
  //         createAlertOpen: false,
  //         createDefaultAlertOpen: false,
  //         createLoading: false,
  //         defaultAlerts: [],
  //         deleteLoading: false,
  //         detailed: null,
  //         editLoading: false,
  //         error: null,
  //         hovered: null,
  //         loading: false,
  //         search: '',
  //         siteSlug: null,
  //         showEdges: false,
  //       },
  //       {
  //         type: TOGGLE_EDGES,
  //       },
  //     ),
  //   ).toEqual({
  //     active: null,
  //     autocompleteFlat: true,
  //     autocompleteLoading: false,
  //     autocompleteTerms: [], // List of next terms you can type
  //     autocompleteThreatSignature: null, // If threat signature is "completed", this stores that object.
  //     collection: [],
  //     createAlertOpen: false,
  //     createDefaultAlertOpen: false,
  //     createLoading: false,
  //     defaultAlerts: [],
  //     deleteLoading: false,
  //     detailed: null,
  //     editLoading: false,
  //     error: null,
  //     hovered: null,
  //     loading: false,
  //     search: '',
  //     siteSlug: null,
  //     showEdges: true,
  //   })
  // })
})
