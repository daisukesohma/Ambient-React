/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown, CircularProgress } from 'ambient_ui'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import get from 'lodash/get'
import { Icon } from 'react-icons-kit'
import { userX } from 'react-icons-kit/feather/userX'
import DataTable from 'components/organisms/DataTable'
import UserCheck from 'ambient_ui/components/icons/contents/UserCheck'
import { Can } from 'rbac'

import Tools from '../../components/TableTools'

import Sites from './Sites'
import Status from './Status'

const ContactTable = ({
  contacts,
  onContactUpdate,
  onContactDelete,
  onContactAssign,
  identitySourcesMetaInfo,
  onSync,
  showAddNowButton,
  emptyComment,
  syncing,
  darkMode,
  loading,
}) => {
  const { palette } = useTheme()
  const [typeSelected, setType] = useState(null)
  const [tableDataArr, setTableDataArr] = useState([])
  const [filteredTableDataArr, setFilteredTableDataArr] = useState([])

  const tableColumns = [
    { title: 'Name', field: 'name' },
    { title: 'Type', field: 'type' },
    // Hide for now because some users may not want their phone numbers displayed in the UI
    // { title: 'Phone number', field: 'phoneNumber' },
    { title: 'Details', field: 'details' },
    { title: 'Status', field: 'status', render: Status },
    { title: 'Site', field: 'site', render: Sites },
  ]

  const renderEditIcon = () => (
    <Can I='update' on='ContactResources'>
      <EditIcon
        style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
      />
    </Can>
  )
  const renderDeleteIcon = () => (
    <Can I='delete' on='ContactResources'>
      <DeleteIcon
        style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
      />
    </Can>
  )
  const renderAssignIcon = () => (
    <Can I='create' on='WorkShifts'>
      <div style={{ cursor: 'pointer', height: 20 }}>
        <UserCheck
          stroke={palette.grey[700]}
          width={22}
          height={22}
          style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
        />
      </div>
    </Can>
  )
  const renderUnassignIcon = () => (
    <div
      style={{
        cursor: 'pointer',
        width: 18,
        height: 18,
        paddingBottom: '8px',
        paddingLeft: '3px',
        paddingRight: '1px',
      }}
    >
      <Icon
        icon={userX}
        style={{
          color: palette.grey[700],
          marginBottom: '8px',
        }}
        size={18}
      />
    </div>
  )

  const renderLoading = () => (
    <CircularProgress color='primary' size={18} variant='indeterminate' />
  )

  const actions = [
    {
      icon: contact =>
        loading
          ? renderLoading()
          : !get(contact, 'status') ||
            get(contact, 'status.endWorkShift') !== null
          ? renderAssignIcon()
          : renderUnassignIcon(),
      tooltip: 'Assign',
      onClick: (e, contact) => onContactAssign(contact),
      variableTooltip: contact =>
        loading
          ? 'Loading'
          : !get(contact, 'status') ||
            get(contact, 'status.endWorkShift') !== null
          ? 'Assign'
          : 'Unassign',
    },
    {
      icon: renderEditIcon,
      tooltip: 'Edit',
      onClick: (e, contact) => onContactUpdate(contact),
      variableTooltip: contact =>
        !get(contact, 'status') || get(contact, 'status.endWorkShift') !== null
          ? 'Edit'
          : 'Contact resource in use',
    },
    {
      icon: renderDeleteIcon,
      tooltip: 'Delete',
      onClick: (e, contact) => onContactDelete(contact),
      variableTooltip: contact =>
        !get(contact, 'status') || get(contact, 'status.endWorkShift') !== null
          ? 'Delete'
          : 'Contact resource in use',
    },
  ]

  const typeOptions = [
    {
      value: null,
      label: 'Filter Type',
    },
    {
      value: 'Phone',
      label: 'Phone',
    },
    {
      value: 'Email',
      label: 'Email',
    },
  ]

  const handleTypeSelection = ({ value }) => {
    setType(value)
    if (value !== null) {
      const filtered = tableDataArr.filter(contact => {
        return get(contact, 'type') === value
      })
      setFilteredTableDataArr(filtered)
    } else {
      setFilteredTableDataArr(tableDataArr)
    }
  }

  const sortValues = {
    status: 'signedIn',
    site: 'name',
  }

  useEffect(() => {
    const tableData = []

    contacts.forEach(contact => {
      if (contact) {
        const details = contact.phoneNumber
          ? contact.phoneNumber
          : contact.email

        const status = {}

        if (contact.lastWorkShiftPeriod) {
          Object.keys(contact.lastWorkShiftPeriod).forEach(key => {
            status[key] = contact.lastWorkShiftPeriod[key]
          })
        }

        if (get(contact, 'lastWorkShiftPeriod') !== null) {
          if (get(contact, 'lastWorkShiftPeriod.endWorkShift') !== null) {
            status.signedIn = -1
          } else {
            status.signedIn = 1
          }
        } else {
          status.signedIn = -1
        }

        tableData.push({
          name: contact.name,
          type:
            contact.contactResourceType.slice(0, 1) +
            contact.contactResourceType
              .slice(1, contact.contactResourceType.length)
              .toLowerCase(),
          details,
          status,
          site: contact.site,
          id: contact.id,
        })
      }
    })
    setTableDataArr(tableData)
    setFilteredTableDataArr(tableData)
  }, [contacts])

  return (
    <DataTable
      darkMode={darkMode}
      actions={actions}
      additionalTools={
        <div style={{ display: 'flex' }}>
          <Tools
            identitySourcesMetaInfo={identitySourcesMetaInfo}
            onSync={onSync}
            syncing={syncing}
            darkMode={darkMode}
          />
          <div style={{ marginRight: 8 }}>
            <SearchableSelectDropdown
              options={typeOptions}
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
              onChange={handleTypeSelection}
              value={typeOptions.filter(({ value }) => {
                return value === typeSelected
              })}
            />
          </div>
        </div>
      }
      columns={tableColumns}
      data={filteredTableDataArr}
      defaultRowsPerPage={10}
      emptyComment={emptyComment}
      showAddNowButton={showAddNowButton}
      sortValues={sortValues}
    />
  )
}

ContactTable.propTypes = {
  darkMode: PropTypes.bool,
  emptyComment: PropTypes.string,
  identitySourcesMetaInfo: PropTypes.object,
  onSync: PropTypes.func,
  onContactDelete: PropTypes.func,
  onContactEdit: PropTypes.func,
  onContactUpdate: PropTypes.func,
  onContactAssign: PropTypes.func,
  showAddNowButton: PropTypes.bool,
  syncing: PropTypes.bool,
  contacts: PropTypes.array,
  loading: PropTypes.bool,
}

ContactTable.defaultProps = {
  darkMode: false,
  identitySourcesMetaInfo: {},
  onSync: () => {},
  onContactDelete: () => {},
  onContactEdit: () => {},
  onContactUpdate: () => {},
  onContactAssign: () => {},
  syncing: false,
  contacts: [],
  loading: false,
}

export default ContactTable
