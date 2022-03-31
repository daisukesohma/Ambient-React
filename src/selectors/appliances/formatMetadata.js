import { createSelector } from '@reduxjs/toolkit'

const formatMetadata = createSelector(
  state => state.appliances.metadata,
  metadata => {
    if (metadata) {
      return {
        change_log: metadata.changeLog,
        created_at: metadata.createdAt,
        package_url: metadata.packageUrl,
        updated_at: metadata.updatedAt,
        version: metadata.version,
      }
    }

    return null
  },
)

export default formatMetadata
