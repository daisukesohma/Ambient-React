// Updated 05/23/2018
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

const INVALID_PASSWORD = {
  message:
    'New password is invalid: [Password needs at least one upper-case character, at least one lower-case character, at least one special character, and one numerical character. It also need to be at least 8 characters in length.',
  level: 'error',
}

const PASSWORDS_UNEQUAL = {
  message: 'New Password and Verify Password do not match.',
  level: 'error',
}

const OLD_PASSWORD_UNEQUAL = {
  message: 'Old Password does not match your current password.',
  level: 'error',
}

const PHONE_NUMBER_REQUIRED_FOR_MFA = {
  message: 'A valid phone number is required for MFA.',
  level: 'error',
}

module.exports = {
  API_CALL_ERROR,
  DUPLICATE_ESCALATION_CONTACT,
  MISSING_INPUTS_ESCALATION_CONTACT,
  DELETION_IN_PROGRESS,
  UPDATE_CONTACT_METHODS_IN_PROGRESS,
  INVALID_PASSWORD,
  PASSWORDS_UNEQUAL,
  OLD_PASSWORD_UNEQUAL,
  PHONE_NUMBER_REQUIRED_FOR_MFA,
}
