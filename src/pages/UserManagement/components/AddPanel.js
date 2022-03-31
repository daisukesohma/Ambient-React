import React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Box from '@material-ui/core/Box'
import Tab from '@material-ui/core/Tab'

import AddIdentitySourceForm from '../IdentitySources/forms/AddIdentitySourceForm'
import UserForm from '../Users/forms/UserForm'

export default function AddPanel({
  accountSlug,
  siteOptions,
  tabIndex,
  userFormLoading,
  setTabIndex,
  addUser,
  hideUserForm,
  addIdentitySource,
  hideIdentityForm,
  identityFormLoading,
  idSourceTypesOptions,
  roleOptions,
  redirectToIdentity,
}) {
  return (
    <div>
      <Tabs
        value={tabIndex}
        indicatorColor='primary'
        textColor='primary'
        onChange={(e, val) => setTabIndex(val)}
        aria-label='disabled tabs example'
        variant='fullWidth'
      >
        <Tab disableRipple label='Add User Manually' />
        <Tab disableRipple label='Add Identity Source' />
      </Tabs>
      <Box p={3}>
        {tabIndex === 0 ? (
          <UserForm
            accountSlug={accountSlug}
            addUser={addUser}
            siteOptions={siteOptions}
            hideForm={hideUserForm}
            loading={userFormLoading}
            roleOptions={roleOptions}
            isTitleShown={false}
          />
        ) : (
          <AddIdentitySourceForm
            addIdentitySource={addIdentitySource}
            hideForm={hideIdentityForm}
            loading={identityFormLoading}
            idSourceTypesOptions={idSourceTypesOptions}
            redirect={redirectToIdentity}
            isTitleShown={false}
          />
        )}
      </Box>
    </div>
  )
}

AddPanel.propTypes = {
  accountSlug: PropTypes.string,
  addIdentitySource: PropTypes.func,
  addUser: PropTypes.func,
  hideIdentityForm: PropTypes.func,
  hideUserForm: PropTypes.func,
  identityFormLoading: PropTypes.bool,
  idSourceTypesOptions: PropTypes.array,
  redirectToIdentity: PropTypes.func,
  roleOptions: PropTypes.array,
  setTabIndex: PropTypes.func,
  siteOptions: PropTypes.array,
  tabIndex: PropTypes.number,
  userFormLoading: PropTypes.bool,
}

AddPanel.defaultProps = {
  accountSlug: '',
  addIdentitySource: () => {},
  addUser: () => {},
  hideIdentityForm: () => {},
  hideUserForm: () => {},
  identityFormLoading: false,
  idSourceTypesOptions: [],
  redirectToIdentity: undefined,
  roleOptions: [],
  setTabIndex: () => {},
  siteOptions: [],
  tabIndex: 0,
  userFormLoading: false,
}
