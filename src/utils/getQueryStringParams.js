/* eslint-disable no-param-reassign */
// via https://stackoverflow.com/questions/42862253/how-to-parse-query-string-in-react-router-v4
// Alex L. Comment: I advice to use the most popular library: https://github.com/sindresorhus/query-string#readme
const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          const [key, value] = param.split('=')
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, ' '))
            : ''
          return params
        }, {})
    : {}
}

export default getQueryStringParams
