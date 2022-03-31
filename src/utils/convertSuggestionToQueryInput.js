// Converts Suggestion shape object from gql getSearchSuggestion object to QueryInput!
// object
//
const convertSuggestionToQueryInput = suggestion => {
  return {
    searchType: suggestion.searchType,
    threatSignatureId: suggestion.params.threatSignatureId,
    aggSize: suggestion.params.aggSize,
    query: suggestion.params.query,
    accessAlarmType: suggestion.params.accessAlarmType,
  }
}

export default convertSuggestionToQueryInput
