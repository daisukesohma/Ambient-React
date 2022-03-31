import dataFromTS from './dataFromTS'

const unixTimeHasData = (unixTs, catalogue) => {
  return !!dataFromTS(catalogue, unixTs).el
}

export default unixTimeHasData
