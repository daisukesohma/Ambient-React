import semver from 'semver'

const isNodeVersionUpgradeable = (currentVersion, latestVersion) => {
  if (currentVersion && latestVersion) {
    const cleanCurrent = semver.clean(currentVersion)
    const cleanLatest = semver.clean(latestVersion)
    if (semver.valid(cleanCurrent) && semver.valid(cleanLatest)) {
      if (semver.lt(cleanCurrent, cleanLatest)) {
        return true
      }
    }
  }
  return false
}

export default isNodeVersionUpgradeable
