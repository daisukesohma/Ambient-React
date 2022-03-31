// when gql returns, it translates underscore case -> snakecase. We need to translate snakecase -> underscore case
//
const formatMetadata = meta => {
  return {
    change_log: meta.changeLog,
    created_at: meta.createdAt,
    package_url: meta.packageUrl,
    updated_at: meta.updatedAt,
    version: meta.version,
  }
}

export default formatMetadata
