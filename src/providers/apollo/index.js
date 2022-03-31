import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient as AuthApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import get from 'lodash/get'
// src
import getHost from 'utils/getHost'

import { persistor, store } from 'redux/store'
import paramsInterceptor from './interceptors/v1/paramsInterceptor'
import responseInterceptor from './interceptors/v1/responseInterceptor'
import exceptionInterceptor from './interceptors/v1/exceptionInterceptor'
import JWTService from 'common/services/JWTService'

class Apollo {
  constructor() {
    this._client = null
    this.createClient()
  }

  get client() {
    return this._client
  }

  set client(client) {
    this._client = client
  }

  createClient(type, data, callback) {
    const uri = `${getHost()}/api/graphql`
    const httpLink = createHttpLink({ uri })

    const authLink = setContext((_, { headers }) => {
      const oldToken = get(store.getState(), 'auth.token')
      const token = JWTService.migrateToken(oldToken)
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          Authorization: token ? `JWT ${token}` : '',
        },
      }
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) => {
          if (JSON.stringify(message).indexOf('expired') !== -1) {
            persistor.purge().then(() => window.location.replace('/login'))
          }
        })
    })

    this.client = new AuthApolloClient({
      link: errorLink.concat(authLink).concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    })

    if (callback) callback()
  }
}

const instance = new Apollo()

export function createQuery(query, variables = {}) {
  return instance.client
    .query({ query, variables })
    .then(responseInterceptor)
    .catch(exceptionInterceptor)
}

export function createMutation(mutation, variables = {}) {
  return instance.client
    .mutate({ mutation, variables })
    .then(responseInterceptor)
    .catch(exceptionInterceptor)
}

export function createQueryV2(query, variables = {}) {
  return instance.client
    .query({ query, variables: paramsInterceptor(variables) })
    .then(responseInterceptor)
    .catch(exceptionInterceptor)
}

export function createMutationV2(mutation, variables = {}) {
  return instance.client
    .mutate({ mutation, variables: paramsInterceptor(variables) })
    .then(responseInterceptor)
    .catch(exceptionInterceptor)
}

export default instance
