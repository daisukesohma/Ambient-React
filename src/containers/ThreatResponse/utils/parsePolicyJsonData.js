import makeUniqueId from '../../../utils/makeUniqueId'

// note security profiles are 1-1 with escalation policies
const parsePolicyJsonData = input => {
  const rawInput = input
  const contacts = {}
  const levels = {}
  const policies = {}
  const policyList = []
  for (let i = 0; i < input.length; i++) {
    const transformedProfile = JSON.parse(JSON.stringify(input[i]))
    const levelsList = []
    const policyUuid = makeUniqueId('profile_policy')
    for (
      let j = 0;
      j < transformedProfile.escalation_policy.levels.length;
      j++
    ) {
      const users = {}
      const levelRep = JSON.parse(
        JSON.stringify(transformedProfile.escalation_policy.levels[j]),
      )
      levelRep.policy = policyUuid
      const contactList = []
      const levelUuid = makeUniqueId('level')
      // necessary to have a list which keeps track of escalationContacts before we squash (an immutable list)
      levelRep.escalationContactIds = []
      for (let k = 0; k < levelRep.contacts.length; k++) {
        // check if user is already in level
        const selectedMethod = levelRep.contacts[k].method
        levelRep.escalationContactIds.push(levelRep.contacts[k])
        if (levelRep.contacts[k].profile === null) {
          continue // eslint-disable-line
        } else if (users[levelRep.contacts[k].profile.user.id] === undefined) {
          const uuid = makeUniqueId('contact')
          contacts[uuid] = levelRep.contacts[k]
          contacts[uuid].methods = {}
          // setting all to false first so there is a value
          contacts[uuid].methods.email = false
          contacts[uuid].methods.text = false
          contacts[uuid].methods.call = false
          contacts[uuid].methods[selectedMethod] = true
          contacts[uuid].composedOf = {}
          contacts[uuid].composedOf[levelRep.contacts[k].method] =
            levelRep.contacts[k].id
          users[levelRep.contacts[k].profile.user.id] = uuid
          contactList.push(uuid)
        } else {
          // if they exist, squash them
          const contactId = users[levelRep.contacts[k].profile.user.id]
          contacts[contactId].composedOf[levelRep.contacts[k].method] =
            levelRep.contacts[k].id
          contacts[contactId].methods[selectedMethod] = true
        }
      }
      levelRep.contacts = contactList
      levelRep.isCreating = false
      levelRep.users = users
      levelsList.push(levelUuid)
      levels[levelUuid] = levelRep
    }
    transformedProfile.levels = levelsList
    transformedProfile.profile_id = transformedProfile.id
    transformedProfile.escalation_policy_id =
      transformedProfile.escalation_policy.id
    delete transformedProfile.escalation_policy
    policies[policyUuid] = transformedProfile
    policyList.push(policyUuid)
  }
  return {
    contacts,
    levels,
    policies,
    policyList,
    rawInput,
  }
}

export default parsePolicyJsonData
