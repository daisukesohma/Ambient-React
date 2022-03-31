// TODO: This is redundant with AlertEventStatusEnum
// and is needed only because the GQL for AlertEventType
// converts choice to enum, thereby capitalizing this stuff
const AckStatusEnum = Object.freeze({
  RAISED: 'raised',
  RESOLVED: 'resolved',
})

export default AckStatusEnum
