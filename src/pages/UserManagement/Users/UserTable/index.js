/* eslint-disable no-unused-vars, no-nested-ternary, */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import remove from 'lodash/remove'
import EditIcon from '@material-ui/icons/EditOutlined'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import Calendar from 'ambient_ui/components/icons/contents/Calendar'
import uniqBy from 'lodash/uniqBy'
import get from 'lodash/get'
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'
import UserCheck from 'ambient_ui/components/icons/contents/UserCheck'
import { Icon } from 'react-icons-kit'
import { userX } from 'react-icons-kit/feather/userX'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRoleOptions } from 'pages/UserManagement/selectors'
import { Can } from 'rbac'
// src

import DataTable from 'components/organisms/DataTable'
import Tools from '../../components/TableTools'
import Sites from './Sites'
import Name from './Name'
import CheckinStatus from './CheckinStatus'
import CopyLink from './CopyLink'
import { setStateValues } from 'pages/UserManagement/redux/userManagementSlice'

const UserTable = ({
  users,
  onUserEdit,
  onUserDelete,
  identitySourcesMetaInfo,
  onSync,
  onResponderAssign,
  showAddNowButton,
  emptyComment,
  syncing,
  onViewUserLoginHistory,
}) => {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const dispatch = useDispatch()

  const [sitesOptions, setSitesOptions] = useState([])
  const userRolesOptions = useSelector(getUserRoleOptions)
  const [tableDataArr, setTableDataArr] = useState([])
  const currentUserRole = useSelector(state => state.auth.profile)
  const currentPage = useSelector(state => state.userManagement.currentPage)
  const pages = useSelector(state => state.userManagement.pages)
  const limit = useSelector(state => state.userManagement.limit)
  const totalCount = useSelector(state => state.userManagement.totalCount)
  const loadingUsers = useSelector(state => state.userManagement.loadingUsers)
  const searchQuery = useSelector(state => state.userManagement.searchQuery)

  const selectStyles = ({ darkMode }) => ({
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
      background: darkMode ? palette.grey[800] : palette.grey[50],
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
  })

  const tableColumns = [
    { title: 'Name', field: 'name', render: Name },
    { title: 'Federation ID', field: 'federationId' },
    // Hide for now because some users may not want their phone numbers displayed in the UI
    // { title: 'Phone number', field: 'phoneNumber' },
    { title: 'Role', field: 'role' },
    { title: 'Status', field: 'lastWorkShiftPeriod', render: CheckinStatus },
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
  const renderAssignIcon = () => (
    <div style={{ cursor: 'pointer', height: 20, paddingBottom: '2px' }}>
      <Can I='create' on='WorkShifts'>
        <UserCheck
          stroke={palette.grey[700]}
          width={22}
          height={22}
          style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
        />
      </Can>
    </div>
  )
  const renderUnassignIcon = () => (
    <div
      style={{
        cursor: 'pointer',
        width: 18,
        height: 18,
        paddingBottom: 8,
        paddingLeft: 3,
        paddingRight: 1,
      }}
    >
      <Icon
        icon={userX}
        style={{
          color: palette.grey[700],
          marginBottom: 8,
        }}
        size={18}
      />
    </div>
  )
  const renderLoginHistoryIcon = () => (
    <div style={{ cursor: 'pointer', height: 20, paddingBottom: '4px' }}>
      <Calendar
        stroke={palette.grey[700]}
        width={22}
        height={22}
        style={{ color: palette.grey[700], cursor: 'pointer', fontSize: 20 }}
      />
    </div>
  )

  const actions = [
    {
      validation: user => !get(user, 'accepted'),
      icon: user => <CopyLink text={user.inviteLink} />,
      tooltip: 'Copy Invite',
      onClick: () => {},
    },
    {
      validation: user => get(user, 'role') === 'Responder',
      icon: user =>
        !get(user, 'lastWorkShiftPeriod.startWorkShift') ||
        get(user, 'lastWorkShiftPeriod.endWorkShift')
          ? renderAssignIcon()
          : renderUnassignIcon(),
      tooltip: 'Assign',
      onClick: (e, user) => onResponderAssign(user),
      variableTooltip: user =>
        !get(user, 'lastWorkShiftPeriod.startWorkShift') ||
        get(user, 'lastWorkShiftPeriod.endWorkShift')
          ? 'Assign'
          : 'Unassign',
    },
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

  actions.push({
    validation: user =>
      get(currentUserRole, 'role.role', null) === 'Administrator',
    icon: renderLoginHistoryIcon,
    tooltip: 'View Login History',
    onClick: (e, user) => onViewUserLoginHistory(user.id),
  })

  const handleSiteSelection = newSelectedSites => {
    const siteSlugs =
      newSelectedSites && newSelectedSites.length > 0
        ? map(newSelectedSites, ({ slug }) => slug)
        : null
    dispatch(
      setStateValues([
        {
          key: 'siteSlugs',
          value: siteSlugs,
        },
      ]),
    )
  }

  const handleRoleSelection = newSelectedRoles => {
    dispatch(
      setStateValues([
        {
          key: 'roleIds',
          value:
            newSelectedRoles && newSelectedRoles.length > 0
              ? map(newSelectedRoles, ({ value }) => Number(value))
              : null,
        },
      ]),
    )
  }

  const sortValues = {
    lastWorkShiftPeriod: 'signedIn',
  }

  useEffect(() => {
    const tableData = []

    const sitesArr = []

    users.forEach(user => {
      let sitesDisplay = []
      if (user.sites && Array.isArray(user.sites)) {
        sitesDisplay = user.sites
        user.sites.forEach(site => {
          sitesArr.push(site)
        })
      }

      const lastWorkShiftPeriod = {}
      if (user.lastWorkShiftPeriod) {
        Object.keys(user.lastWorkShiftPeriod).forEach(key => {
          lastWorkShiftPeriod[key] = user.lastWorkShiftPeriod[key]
        })
      }

      if (get(user, 'lastWorkShiftPeriod') !== null) {
        if (get(user, 'lastWorkShiftPeriod.endWorkShift') === null) {
          lastWorkShiftPeriod.signedIn = -2
        } else {
          lastWorkShiftPeriod.signedIn = -1
        }
      } else if (
        !(user.role.role === 'Operator' || user.role.role === 'Responder')
      ) {
        lastWorkShiftPeriod.signedIn = 1
      } else {
        lastWorkShiftPeriod.signedIn = 0
      }

      tableData.push({
        img: user.img,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        federationId: user.federationId,
        email: user.email,
        inviteLink: user.inviteLink,
        accepted: user.accepted,
        role: get(user, 'role.name'),
        roleId: get(user, 'role.id'), // needed for filtering
        sites: sitesDisplay,
        id: user.id,
        profileId: user.profileId,
        lastWorkShiftPeriod,
      })
    })
    setTableDataArr(tableData)
    setSitesOptions(
      orderBy(uniqBy(sitesArr, 'value'), [
        object => object.label.toLowerCase(),
      ]),
    )
  }, [users])

  return (
    <DataTable
      actions={actions}
      darkMode={darkMode}
      additionalTools={
        <div style={{ display: 'flex' }}>
          <Tools
            identitySourcesMetaInfo={identitySourcesMetaInfo}
            onSync={onSync}
            syncing={syncing}
          />
          <div style={{ marginRight: 8 }}>
            <SearchableSelectDropdown
              options={userRolesOptions}
              styles={selectStyles({ darkMode })}
              isSearchable={false}
              onChange={handleRoleSelection}
              placeholder='Filter Roles'
              isMulti
            />
          </div>
          <div style={{ marginRight: 8 }}>
            <SearchableSelectDropdown
              options={sitesOptions}
              styles={selectStyles({ darkMode })}
              onChange={handleSiteSelection}
              placeholder='Filter Sites'
              isMulti
            />
          </div>
        </div>
      }
      columns={tableColumns}
      data={tableDataArr}
      defaultRowsPerPage={10}
      emptyComment={emptyComment}
      showAddNowButton={showAddNowButton}
      sortValues={sortValues}
      serverSideProcessing
      page={currentPage}
      rowsPerPage={limit}
      defaultSearchValue={searchQuery}
      pages={pages}
      setPage={page => {
        dispatch(setStateValues([{ key: 'currentPage', value: page }]))
      }}
      setRowsPerPage={rowsPerPage => {
        dispatch(setStateValues([{ key: 'limit', value: rowsPerPage }]))
      }}
      onSearch={searchQuery => {
        dispatch(setStateValues([{ key: 'searchQuery', value: searchQuery }]))
      }}
      isLoading={loadingUsers}
      totalCountOverride={totalCount}
    />
  )
}

UserTable.propTypes = {
  emptyComment: PropTypes.string,
  identitySourcesMetaInfo: PropTypes.object,
  onSync: PropTypes.func,
  onResponderAssign: PropTypes.func,
  onUserDelete: PropTypes.func,
  onUserEdit: PropTypes.func,
  showAddNowButton: PropTypes.bool,
  syncing: PropTypes.bool,
  users: PropTypes.array,
}

UserTable.defaultProps = {
  identitySourcesMetaInfo: {},
  onSync: () => {},
  onResponderAssign: () => {},
  onUserDelete: () => {},
  onUserEdit: () => {},
  syncing: false,
  users: [],
}

export default UserTable
