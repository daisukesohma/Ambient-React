export const getThreatCanonicalId = threat => {
  return threat.defaultAlert
    ? `#TS00 ${threat.defaultAlert.id}`
    : `#LEGACY ${threat.id}`
}
