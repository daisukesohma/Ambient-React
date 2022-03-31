// currently our isHard flag on Alert decides if it's high priority. We have no "low" concept
// // today
export default function convertIsHardToAlertLevel(isHard) {
  if (isHard) {
    return 'high'
  }
  return 'medium'
}
