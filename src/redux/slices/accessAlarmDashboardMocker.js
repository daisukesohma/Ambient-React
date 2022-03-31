const DIFF_AMOUNT = 1
const template = {
  accessAlarmTypeDistributions: [
    {
      name: 'Granted Access',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Granted: No Entry',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Invalid Badge',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Door Forced Open',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Door Held Open',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Door Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Active Alarm',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Technical Notification',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'AED Cabinet Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Alarm Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Alarm Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Supervisory Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Supervisory Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Trouble Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Fire Trouble Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Duress Button Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Duress Button Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'High Temperature Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'High Temperature Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'High Humidity Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'High Humidity Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Water Alarm Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Water Alarm Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Courtesy Phone Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Courtesy Phone Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Dead Bolt Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Dead Bolt Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Power Alarm Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Power Alarm Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Door Contact - Emergency Exit Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Door Contact - Emergency Exit Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Door/Window Contact Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Door/Window Contact Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Glass Break Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Glass Break Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Communication Failure Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Communication Failure Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'Open Loop Active',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Open Loop Restored',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },

    {
      name: 'AED Disarmed',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
    {
      name: 'Other',
      value: 0,
      rawCount: 0,
      ambientCount: 0,
      __typename: 'AccessAlarmTypeDistributionDataType',
    },
  ],
  accessReaderList: {
    'Door Held Open': [
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Main Entry',
          __typename: 'AccessReaderType',
          stream: {
            id: 339,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Lab',
          __typename: 'AccessReaderType',
          stream: {
            id: 348,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: SOC',
          __typename: 'AccessReaderType',
          stream: {
            id: 360,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
    ],
    'Door Forced Open': [
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Main Entry',
          __typename: 'AccessReaderType',
          stream: {
            id: 339,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Lab',
          __typename: 'AccessReaderType',
          stream: {
            id: 348,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: SOC',
          __typename: 'AccessReaderType',
          stream: {
            id: 360,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
    ],
    'Communication Failure': [
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Main Entry',
          __typename: 'AccessReaderType',
          stream: {
            id: 339,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Lab',
          __typename: 'AccessReaderType',
          stream: {
            id: 348,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: SOC',
          __typename: 'AccessReaderType',
          stream: {
            id: 360,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
    ],
    'Open Loop': [
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Main Entry',
          __typename: 'AccessReaderType',
          stream: {
            id: 339,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: Lab',
          __typename: 'AccessReaderType',
          stream: {
            id: 348,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
      {
        alertCount: 0,
        onAmbient: true,
        reader: {
          id: '1',
          deviceId: 'READER: SOC',
          __typename: 'AccessReaderType',
          stream: {
            id: 360,
            name: 'Entry Stairwell',
            __typename: 'StreamType',
          },
        },
        __typename: 'AccessReaderSummaryType',
      },
    ],
  },
  doorPacsAlertEventDistribution: [
    {
      count: 4,
      threatSignature: {
        name: 'Door Propped Open [Access-verified]',
        __typename: 'ThreatSignatureType',
      },
      __typename: 'PACSAlertEventMapDataType',
    },
  ],
  invalidBadgePacsAlertEventDistribution: [
    {
      count: 4,
      threatSignature: {
        name: 'Invalid Badge followed by Tailgating',
        __typename: 'ThreatSignatureType',
      },
      __typename: 'PACSAlertEventMapDataType',
    },
  ],
}

const accessAlarmDashboardMocker = (startTs, endTs) => {
  const diff = endTs - startTs
  const days = diff / 86400
  const amt = days * 36

  let doorAlerts = 0
  let invalidBadgeAlerts = 0
  let doorHeldOpen = 0
  let doorForcedOpen = 0
  let communicationFailure = 0
  let openLoop = 0

  for (let i = 0; i < template.accessAlarmTypeDistributions.length; ++i) {
    template.accessAlarmTypeDistributions[i].value =
      amt + template.accessAlarmTypeDistributions[i].name.length
    template.accessAlarmTypeDistributions[i].rawValue =
      amt + template.accessAlarmTypeDistributions[i].name.length
    template.accessAlarmTypeDistributions[i].ambientCount =
      Math.round(
        Math.random() * template.accessAlarmTypeDistributions[i].value,
      ) + 1

    if (
      ['Door Held Open', 'Door Forced Open'].includes(
        template.accessAlarmTypeDistributions[i].name,
      )
    ) {
      doorAlerts += template.accessAlarmTypeDistributions[i].ambientCount
    }

    if (
      ['Invalid Badge'].includes(template.accessAlarmTypeDistributions[i].name)
    ) {
      invalidBadgeAlerts +=
        template.accessAlarmTypeDistributions[i].ambientCount
    }

    if (
      ['Door Held Open'].includes(template.accessAlarmTypeDistributions[i].name)
    ) {
      doorHeldOpen += template.accessAlarmTypeDistributions[i].ambientCount
    }

    if (
      ['Door Forced Open'].includes(
        template.accessAlarmTypeDistributions[i].name,
      )
    ) {
      doorForcedOpen += template.accessAlarmTypeDistributions[i].ambientCount
    }

    if (
      ['Communication Failure'].includes(
        template.accessAlarmTypeDistributions[i].name,
      )
    ) {
      communicationFailure +=
        template.accessAlarmTypeDistributions[i].ambientCount
    }

    if (['Open Loop'].includes(template.accessAlarmTypeDistributions[i].name)) {
      openLoop += template.accessAlarmTypeDistributions[i].ambientCount
    }
  }

  for (let i = 0; i < template.doorPacsAlertEventDistribution.length; ++i) {
    template.doorPacsAlertEventDistribution[i].count = Math.min(
      doorAlerts,
      Math.max(Math.round((Math.random() * 0.02 + 0.05) * doorAlerts), 0),
    )
  }

  for (
    let i = 0;
    i < template.invalidBadgePacsAlertEventDistribution.length;
    ++i
  ) {
    template.invalidBadgePacsAlertEventDistribution[i].count = Math.min(
      invalidBadgeAlerts,
      Math.max(
        Math.round((Math.random() * 0.02 + 0.05) * invalidBadgeAlerts),
        0,
      ),
    )
  }

  const keys = Object.keys(template.accessReaderList)
  for (let i = 0; i < keys.length; ++i) {
    for (let j = 0; j < template.accessReaderList[keys[i]].length; ++j) {
      if (keys[i] === 'Door Held Open') {
        if (keys.length - 1 === i) {
          template.accessReaderList[keys[i]][j].alertCount = doorHeldOpen
        } else {
          const currAmtDoorHeld = Math.round(Math.random() * doorHeldOpen) + 1
          template.accessReaderList[keys[i]][j].alertCount = currAmtDoorHeld
          doorHeldOpen -= currAmtDoorHeld
        }
      }

      if (keys[i] === 'Door Forced Open') {
        if (keys.length - 1 === i) {
          template.accessReaderList[keys[i]][j].alertCount = doorForcedOpen
        } else {
          const currAmtForced = Math.round(Math.random() * doorForcedOpen) + 1
          template.accessReaderList[keys[i]][j].alertCount = currAmtForced
          doorForcedOpen -= currAmtForced
        }
      }

      if (keys[i] === 'Communication Failure') {
        if (keys.length - 1 === i) {
          template.accessReaderList[keys[i]][
            j
          ].alertCount = communicationFailure
        } else {
          const currAmt = Math.round(Math.random() * communicationFailure) + 1
          template.accessReaderList[keys[i]][j].alertCount = currAmt
          communicationFailure -= currAmt
        }
      }

      if (keys[i] === 'Open Loop') {
        if (keys.length - 1 === i) {
          template.accessReaderList[keys[i]][j].alertCount = openLoop
        } else {
          const currAmtLoop = Math.round(Math.random() * openLoop) + 1
          template.accessReaderList[keys[i]][j].alertCount = currAmtLoop
          openLoop -= currAmtLoop
        }
      }
    }
  }

  return template
}

export default accessAlarmDashboardMocker
