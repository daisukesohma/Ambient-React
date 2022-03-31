import { createSelector } from '@reduxjs/toolkit'
import map from 'lodash/map'

export default createSelector(
  [state => state.externalContacts.contacts],
  contacts =>
    map(contacts, ({ id, name, email, phoneNumber }) => ({
      id,
      name,
      email,
      phoneNumber,
    })),
)
