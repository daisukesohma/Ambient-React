const useStackBarData = ({ originalDistribution, ambientDistribution }) => {
  const DEFAULT_ORIGINAL_DATA = { type: 'PACS Alarms' }
  const DEFAULT_AMBIENT_DATA = { type: 'Ambient Alerts' }
  const originalKeys = originalDistribution.map(d => d.name)
  const ambientKeys = ambientDistribution.map(d => d.name)
  const stackBarKeys = [...originalKeys, ...ambientKeys]
  const originalData = { ...DEFAULT_ORIGINAL_DATA }
  const ambientData = { ...DEFAULT_AMBIENT_DATA }
  let ambientTotal = 0
  let originalTotal = 0

  originalDistribution.forEach(({ name, ambientCount }) => {
    originalData[name] = ambientCount
    originalTotal += ambientCount
    ambientData[name] = 0
  })

  ambientDistribution.forEach(({ threatSignature: { name }, count }) => {
    originalData[name] = 0
    ambientData[name] = count
    ambientTotal += count
  })

  if (originalTotal) {
    return {
      stackBarKeys,
      originalData,
      ambientData,
      originalTotal,
      ambientTotal,
    }
  }
  return {
    stackBarKeys,
    originalData: DEFAULT_ORIGINAL_DATA,
    ambientData: DEFAULT_AMBIENT_DATA,
    originalTotal: 0,
    ambientTotal: 0,
  }
}

export default useStackBarData
