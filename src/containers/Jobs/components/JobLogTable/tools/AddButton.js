import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
// src
import { AddOptionMenu } from 'ambient_ui'
import { NodeRequestTypeEnum } from 'enums'

function AddButton() {
  const history = useHistory()
  const { account } = useParams()
  return (
    <div style={{ marginRight: 16 }}>
      <span>
        <AddOptionMenu
          darkMode={false}
          menuItems={[
            {
              label: 'Start Stream Discovery',
              value: NodeRequestTypeEnum.DISCOVERY,
              onClick: () => {
                history.push(
                  `/accounts/${account}/infrastructure/discovery/create`,
                )
              },
            },
            // {
            //   label: 'Restart Node',
            //   value: NodeRequestTypeEnum.RESTART,
            //   onClick: () => {},
            // },
          ]}
          textClass='am-subtitle2'
          noBackground
        />
      </span>
    </div>
  )
}

export default AddButton
