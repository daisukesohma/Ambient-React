export const threatSignatureWithRegions = (threatSignature, alerts) => {
  // adding regions to threatSignature
  return {
    ...threatSignature,
    alerts: alerts.filter(
      alert => alert.threatSignature.id === threatSignature.id,
    ),
  }
}
