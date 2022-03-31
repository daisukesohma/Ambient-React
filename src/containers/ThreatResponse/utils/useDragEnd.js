import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import last from 'lodash/last'
import isEmpty from 'lodash/isEmpty'

import { rearrangeContactRequested } from '../../../redux/threatEscalation/actions'

/*
  Nguyen Van Dung Author of this method. (Alex L. wrapped method into hook to avoid duplication of code)
 */

export default ({ securityProfiles, siteSlug, account }) => {
  const dispatch = useDispatch()

  return useCallback(
    (dropResult, afterUpdate = () => {}) => {
      const { source, destination, draggableId } = dropResult

      const contactId = last(draggableId.split(':'))

      if (isEmpty(destination) || isEmpty(contactId)) return false

      let selectedContact = null
      securityProfiles.forEach(sp => {
        if (sp.escalationPoliciesForSev) {
          sp.escalationPoliciesForSev.forEach(item => {
            if (item.escalationPolicy) {
              item.escalationPolicy.levels.forEach(spLevel => {
                let contactProfileId = ''
                spLevel.contacts.forEach(contact => {
                  if (contact.id === Number(contactId)) {
                    contactProfileId = contact.profile.id
                  }
                })
                const contactMethods = []
                if (contactProfileId) {
                  spLevel.contacts.forEach(contact => {
                    if (contact.profile.id === contactProfileId) {
                      contactMethods.push(contact.method)
                    }
                  })
                  selectedContact = {
                    profileId: contactProfileId,
                    methods: contactMethods,
                  }
                }
              })
            }
          })
        }
      })

      const payload = {
        source: {
          ...selectedContact,
          levelId: source.droppableId,
          position: source.index,
        },
        destination: {
          levelId: destination.droppableId,
          position: destination.index,
        },
        siteSlug,
        accountSlug: account,
        afterUpdate,
      }

      return dispatch(rearrangeContactRequested(payload))
    },
    [account, dispatch, securityProfiles, siteSlug],
  )
}
