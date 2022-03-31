import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid, Typography, Divider } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link'
import { Button } from 'ambient_ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { get, map, includes } from 'lodash'
import clsx from 'clsx'
// src
import ConfirmDialog from 'components/ConfirmDialog'
import { updateFederations as updateFederationAction } from 'redux/slices/auth'

import useStyles from './styles'
import { GET_AZURE_USER_LIST, CREATE_FEDERATION_PROFILES } from './gql'

function Federation({ identitySourceId, profileId, updateFederation }) {
  const classes = useStyles()
  const [federations, setFederations] = useState([])
  const [selected, setSelected] = useState([])
  const [selectedUserPrincipals, setSelectedUserPrincipals] = useState([])
  const [isCancelConfirm, setIsCancelConfirm] = useState(false)
  const [isCreateConfirm, setIsCreateConfirm] = useState(false)

  const location = useLocation()
  const history = useHistory()

  // third step of first workflow ( get user list from microsoft azure )
  const { data } = useQuery(GET_AZURE_USER_LIST, {
    variables: {
      identitySourceId,
    },
  })

  const [createFederationProfiles, { loading: creating }] = useMutation(
    CREATE_FEDERATION_PROFILES,
  )

  const handleItemClick = federation => () => {
    const temp = [...selected]
    const tempUserPrincipalName = [...selectedUserPrincipals]
    const { id, userPrincipalName } = federation
    if (temp.includes(id)) {
      temp.splice(temp.indexOf(id), 1)
      tempUserPrincipalName.splice(
        tempUserPrincipalName.indexOf(userPrincipalName),
        1,
      )
    } else {
      temp.push(id)
      tempUserPrincipalName.push(userPrincipalName)
    }
    setSelected(temp)
    setSelectedUserPrincipals(tempUserPrincipalName)
  }

  const showConfirmDialog = () => {
    setIsCreateConfirm(true)
  }

  const hideCreateDialog = () => {
    setIsCreateConfirm(false)
  }

  // 4th step of first workflow
  // create federation profile based on selected microsoft azure user
  // and associates it current user
  // Necessary because we deactivate users after an identity source is added.
  // We need to associate current user to a FederationProfile to prevent this
  const handleCreateConfirm = async () => {
    const { pathname } = location
    const profileIds = selected.map(() => profileId)
    await createFederationProfiles({
      variables: {
        profileIds,
        usernames: selectedUserPrincipals,
        identifiers: selected,
        identitySourceId,
      },
    })
    updateFederation(selected)
    hideCreateDialog()
    history.push(pathname.replace('select-federation', 'identity-sources'))
  }

  const showCancelDialog = () => {
    setIsCancelConfirm(true)
  }

  const hideCancelDialog = () => {
    setIsCancelConfirm(false)
  }

  const handleCancelConfirm = async () => {
    setIsCancelConfirm(false)
    const { pathname } = location
    history.push(pathname.replace('select-federation', 'identity-sources'))
  }

  useEffect(() => {
    if (data && data.getAzureUserList) {
      setFederations(data.getAzureUserList)
    }
  }, [data])

  return (
    <Grid container className={classes.root}>
      <Grid container className={classes.paper}>
        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.header}>
            <Typography className='am-h5'>Account Selection</Typography>
            <div className={classes.federationIdWrapper}>
              <LinkIcon fontSize='small' style={{ marginRight: 8 }} />
              Azure active Directory
            </div>
          </div>
        </Grid>
        <div className={classes.divider}>
          <Divider />
        </div>
        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <div className={classes.listContainer}>
            <Typography className={classes.subTitle}>
              Select the account you’re associated with
            </Typography>
            <div className={classes.list}>
              {map(federations, (federation, index) => (
                <div
                  className={clsx(classes.itemContainer, {[classes.active]: includes(selected, federation.id)})}
                  key={index}
                  onClick={handleItemClick(federation)}
                >
                  <div className={classes.name}>
                    {`${federation.givenName} ${federation.surname}`}
                  </div>
                  <div className={classes.email}>
                    {federation.userPrincipalName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container justify='flex-end' className={classes.bottom}>
            <Button
              variant='outlined'
              dataDismiss='modal'
              onClick={showCancelDialog}
              customStyle={{ marginRight: 5 }}
            >
              Cancel
            </Button>
            <Button
              onClick={showConfirmDialog}
              disabled={selected.length === 0}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={isCreateConfirm}
        onClose={hideCreateDialog}
        onConfirm={handleCreateConfirm}
        content='Are you sure you want to link these federations with an Identity Source?'
        loading={creating}
      />
      <ConfirmDialog
        open={isCancelConfirm}
        onClose={hideCancelDialog}
        onConfirm={handleCancelConfirm}
        content='Are you sure you want to leave this page?'
      />
    </Grid>
  )
}

Federation.propTypes = {
  identitySourceId: PropTypes.string,
  profileId: PropTypes.string,
  updateFederation: PropTypes.func,
}

Federation.defaultProps = {
  identitySourceId: '',
  profileId: '',
  updateFederation: () => {},
}

const mapStateToProps = state => {
  return {
    identitySourceId: get(state, 'settings.redirectUrl.syncId'),
    profileId: get(state, 'auth.profile.id'),
  }
}

const mapDispatchToProps = dispatch => ({
  updateFederation: data => dispatch(updateFederationAction(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Federation)
