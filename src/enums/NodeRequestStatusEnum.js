// Node Request Statuses (table: portal_noderequest.status)
//

const NodeRequestStatusEnum = {
  // statuses which node assigns to table from appliance code
  INCOMPLETE: 'incomplete',
  INPROGRESS: 'inprogress',
  COMPLETED: 'completed',
  FAILED: 'failed',

  // Used for Camera Discovery workflow status
  // UI Statuses
  //
  CAMERA_ACTIVATED: 'onboardingcomplete', // consolidate with below
  ONBOARDINGCOMPLETE: 'onboardingcomplete', // at the end of the onboarding workflow
  ACTIVATIONCOMPLETE: 'activationcomplete', // at end of activation but unknown node request='RESTART' status
}

export default NodeRequestStatusEnum
