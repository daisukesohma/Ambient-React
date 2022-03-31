import semver from 'semver'

const MINIMUM_RESTARTABLE_VERSION = '1.0.0'

// Compares version to 1.0.0
const isNodeVersionConfigMonitorEnabled = version => {
  if (version) {
    const cleanVersion = semver.clean(version)
    const isValidVersion = semver.valid(cleanVersion)

    if (
      isValidVersion &&
      semver.gte(isValidVersion, MINIMUM_RESTARTABLE_VERSION)
    ) {
      return true
    }
  }

  return false
}

export default isNodeVersionConfigMonitorEnabled
