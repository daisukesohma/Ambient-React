/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'
import remove from 'lodash/remove'
import EditIcon from '@material-ui/icons/EditOutlined'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import uniqBy from 'lodash/uniqBy'
import get from 'lodash/get'
// src
import DataTable from 'components/organisms/DataTable'
import Tooltip from 'components/Tooltip'
import Tools from '../../components/TableTools'

import Sites from './Sites'
import Name from './Name'

const allOption = {
  label: 'All',
  value: '',
}

const UserTable = ({
  users,
  onUserEdit,
  onUserDelete,
  identitySourcesMetaInfo,
  onSync,
  showAddNowButton,
  emptyComment,
  syncing,
}) => {
  const { palette } = useTheme()
  const [sitesOptions, setSitesOptions] = useState([allOption])
  const [tableDataArr, setTableDataArr] = useState([])
  const [filteredTableDataArr, setFilteredTableDataArr] = useState([])

  const tableColumns = [
    { title: 'Name', field: 'name', render: Name },
    { title: 'Federation ID', field: 'federationId' },
    // Hide for now because some users may not want their phone numbers displayed in the UI
    // { title: 'Phone number', field: 'phoneNumber' },
    { title: 'Role', field: 'role' },
    // Hide for now because admin will always have N/A
    // { title: 'Availability', field: 'availability', render: Availability },
    { title: 'Sites', field: 'sites', render: Sites },
  ]

  const { hasIdentitySources } = identitySourcesMetaInfo
  if (!hasIdentitySources) {
    // if the account has active identity sources, we need get rid of the column
    remove(tableColumns, column => column.title === 'Federation ID')
  }
  const renderEditIcon = () => (
    <EditIcon
      style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
    />
  )
  const renderInfoIcon = () => (
    <InfoIcon
      style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
    />
  )
  const renderDeleteIcon = () => (
    <DeleteIcon
      style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
    />
  )

  const actions = [
    {
      icon: hasIdentitySources ? renderInfoIcon : renderEditIcon,
      tooltip: hasIdentitySources ? 'View' : 'Edit',
      onClick: (e, user) => onUserEdit(user.id),
    },
  ]
  if (!hasIdentitySources) {
    actions.push({
      icon: renderDeleteIcon,
      tooltip: 'Delete',
      onClick: (e, user) => onUserDelete(user.username),
    })
  }

  const handleSiteSelection = ({ value }) => {
    if (!value) {
      setFilteredTableDataArr(tableDataArr)
      return
    }
    const filtered = tableDataArr.filter(item => {
      return item.sites.some(site => site.value === value)
    })
    setFilteredTableDataArr(filtered)
  }

  useEffect(() => {
    const tableData = []

    const sitesArr = []

    users.forEach(user => {
      let phoneNumberDisplay = user.phoneNumber

      if (
        user.role.role === 'Responder' &&
        (user.phoneNumber === '' ||
          user.phoneNumber === null ||
          user.phoneNumber === undefined)
      ) {
        phoneNumberDisplay = (
          <Tooltip
            content='Responders need a phone number in order to receive alerts and dispatch requests.'
            trigger='mouseenter'
          >
            <span style={{ display: 'flex' }}>
              <i
                className='fa fa-exclamation-triangle text-danger'
                style={{ marginTop: '2px', marginRight: '4px' }}
              />
              <p>Phone Number missing.</p>
            </span>
          </Tooltip>
        )
      }

      let sitesDisplay = []
      if (user.sites && Array.isArray(user.sites)) {
        sitesDisplay = user.sites
        user.sites.forEach(site => {
          sitesArr.push(site)
        })
      }

      let checkInDisplay = user.isSignedIn ? 'Checked In' : 'Unavailable'
      if (!(user.role.role === 'Operator' || user.role.role === 'Responder')) {
        checkInDisplay = 'N/A'
      }

      tableData.push({
        img: user.img,
        name: `${user.firstName} ${user.lastName}`,
        // availability: checkInDisplay,
        username: user.username,
        federationId: user.federationId,
        email: user.email,
        // phoneNumber: phoneNumberDisplay,
        role: get(user, 'role.name'),
        sites: sitesDisplay,
        id: user.id,
      })
    })
    setTableDataArr(tableData)
    setSitesOptions([allOption, ...uniqBy(sitesArr, 'value')])
    setFilteredTableDataArr(tableData)
  }, [users])

  return (
    <DataTable
      actions={actions}
      additionalTools={
        <div style={{ display: 'flex' }}>
          <Tools
            identitySourcesMetaInfo={identitySourcesMetaInfo}
            onSync={onSync}
            syncing={syncing}
          />
          <div style={{ marginRight: 8 }}>
            <SearchableSelectDropdown
              options={sitesOptions}
              styles={{
                menu: (provided, state) => ({
                  ...provided,
                  boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
                  zIndex: 20,
                  borderRadius: 0,
                  margin: 0,
                  cursor: 'pointer',
                }),
                control: provided => ({
                  ...provided,
                  backgroundColor: palette.grey[50],
                  borderRadius: 0,
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  '&:hover': {
                    border: 'none',
                    boxShadow: 'none',
                  },
                  cursor: 'pointer',
                }),
                valueContainer: provided => ({
                  ...provided,
                  minWidth: 100,
                  cursor: 'pointer',
                }),
              }}
              isSearchable={false}
              onChange={handleSiteSelection}
              placeholder='Filter Sites'
            />
          </div>
        </div>
      }
      columns={tableColumns}
      data={filteredTableDataArr}
      defaultRowsPerPage={10}
      emptyComment={emptyComment}
      showAddNowButton={showAddNowButton}
    />
  )
}

UserTable.propTypes = {
  emptyComment: PropTypes.string,
  identitySourcesMetaInfo: PropTypes.object,
  onSync: PropTypes.func,
  onUserDelete: PropTypes.func,
  onUserEdit: PropTypes.func,
  showAddNowButton: PropTypes.bool,
  syncing: PropTypes.bool,
  users: PropTypes.array,
}

UserTable.defaultProps = {
  identitySourcesMetaInfo: {},
  onSync: () => {},
  onUserDelete: () => {},
  onUserEdit: () => {},
  syncing: false,
  users: [],
}

export default UserTable
