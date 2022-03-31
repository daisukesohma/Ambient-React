const API_CALL_ERROR = {
  message: 'Service is down. Please come back later.',
  level: 'error',
}

const DUPLICATE_ESCALATION_CONTACT = {
  message:
    'Escalation Contact already in Escalation Level. Just click on contact method indicators to change the contact methods for that escalation contact.',
  level: 'error',
}

const MISSING_INPUTS_ESCALATION_CONTACT = {
  message: 'Please input a profile and/or method of contact.',
  level: 'error',
}

const DELETION_IN_PROGRESS = {
  message:
    'Existing deletion in progress. Please confirm existing deletion first.',
  level: 'error',
}

const UPDATE_CONTACT_METHODS_IN_PROGRESS = {
  message: 'Updating contact methods currently in progress. Please wait.',
  level: 'error',
}

module.exports = {
  API_CALL_ERROR,
  DUPLICATE_ESCALATION_CONTACT,
  MISSING_INPUTS_ESCALATION_CONTACT,
  DELETION_IN_PROGRESS,
  UPDATE_CONTACT_METHODS_IN_PROGRESS,
}
