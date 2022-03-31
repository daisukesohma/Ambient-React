import React, { Component } from 'react'
import { compose } from 'redux'
import { withTheme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import Grid from '@material-ui/core/Grid'
import { SearchableSelectDropdown, CircularProgress, Button } from 'ambient_ui'
import get from 'lodash/get'

import { getAccountSlug } from '../../../../utils'
import {
  DUPLICATE_ESCALATION_CONTACT,
  MISSING_INPUTS_ESCALATION_CONTACT,
} from '../../data/notifications'
import {
  escalationContactUpdate,
  notificationMethodsFetchRequested,
  profilesFetchRequested,
} from '../../../../redux/threatEscalation/actions'
import UserAvatar from '../../../../components/UserAvatar'

import './index.css'

const ProfileSelectOption = props => {
  const { data } = props
  return (
    <components.Option {...props}>
      <Grid container alignItems='center'>
        <UserAvatar img={data.img} name={data.label} size={24} />
        <span className='select-label'>{data.label}</span>
      </Grid>
    </components.Option>
  )
}

ProfileSelectOption.defaultProps = {
  data: {},
}

ProfileSelectOption.propTypes = {
  data: PropTypes.object,
}

class EscalationContactCreationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [
        { value: 'email', label: 'Email' },
        { value: 'text', label: 'Text' },
        { value: 'call', label: 'Call' },
      ],
      profiles: [],
      methodsOfContact: [],
      profile: null,
      error: '',
    }

    this.handleOnChangeMethod = this.handleOnChangeMethod.bind(this)
    this.handleOnChangeProfile = this.handleOnChangeProfile.bind(this)
    this.createEscalationContactButtonPress = this.createEscalationContactButtonPress.bind(
      this,
    )
  }

  componentDidMount() {
    const {
      accountSlug,
      siteSlug,
      getNotificationMethods,
      getProfiles,
    } = this.props
    getProfiles({ accountSlug, siteSlug })
    getNotificationMethods()
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(next) {
    const { profiles, notificationMethods } = next
    if (notificationMethods) {
      this.setState({
        options: notificationMethods.map(({ method }) => ({
          value: method.toLowerCase(),
          label: method,
        })),
      })
    }
    if (profiles) {
      const options = []
      let label
      for (let i = 0; i < profiles.length; ++i) {
        if (profiles[i].user !== null) {
          label =
            `${profiles[i].user.firstName} ${profiles[i].user.lastName}` === ''
              ? `${profiles[i].user.username}`
              : `${profiles[i].user.firstName} ${profiles[i].user.lastName}`
          options.push({
            value: profiles[i],
            label,
            img: profiles[i].img,
          })
        }
      }
      this.setState({
        profiles: options,
      })
    }
  }

  handleOnChangeMethod(value) {
    this.setState({ methodsOfContact: value, error: '' }, () => {})
  }

  handleOnChangeProfile(selection) {
    this.setState({ profile: selection, error: '' }, () => {})
  }

  createEscalationContactButtonPress() {
    const { level } = this.props
    const contacts = level.contacts || []
    if (
      this.state.profile === null ||
      this.state.methodsOfContact.length === 0
    ) {
      this.props._createNotification(MISSING_INPUTS_ESCALATION_CONTACT)
    } else if (contacts[this.state.profile.value.user.id] !== undefined) {
      // check if profile is already on a list
      this.props._createNotification(DUPLICATE_ESCALATION_CONTACT)
    } else {
      this.props.handleCreateEscalationContact(
        {
          profileId: this.state.profile.value.id,
          methods: this.state.methodsOfContact.map(({ value }) => value),
          escalationLevelId: this.props.levelId,
          accountSlug: this.props.accountSlug,
          siteSlug: this.props.siteSlug,
        },
        () => {
          this.setState(
            {
              methodsOfContact: [],
              error: '',
              profile: null,
            },
            () => {},
          )
        },
      )
    }
  }

  render() {
    return (
      <div className='escalationContactForm'>
        <div className='am-body2'>Add Escalation Contact:</div>
        <div className='am-subtitle2'>Profile:</div>
        <SearchableSelectDropdown
          placeholder='Type a Name'
          options={this.state.profiles}
          onChange={this.handleOnChangeProfile}
          value={this.state.profile}
          components={{ Option: ProfileSelectOption }}
          menuPlacement='top'
        />
        <br />
        <div className='am-subtitle2'>Method of Contact:</div>
        <SearchableSelectDropdown
          placeholder='Select Contact Methods'
          isMulti
          isClearable
          onChange={this.handleOnChangeMethod}
          value={this.state.methodsOfContact}
          options={this.state.options}
          menuPlacement='top'
        />
        <br />
        <div className='escalationContactForm__buttons'>
          <Button
            onClick={this.props.hideContactForm}
            customStyle={{
              marginRight: 5,
              color: this.props.theme.palette.primary.main,
            }}
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            onClick={this.createEscalationContactButtonPress}
            disabled={this.props.state.isSending}
            variant='contained'
          >
            {this.props.state.isSending ? <CircularProgress /> : 'Confirm'}
          </Button>
        </div>
      </div>
    )
  }
}

EscalationContactCreationForm.propTypes = {
  data: PropTypes.object,
  state: PropTypes.object,
  level: PropTypes.object,
  _createNotification: PropTypes.func,
  levelId: PropTypes.number,
  handleCreateEscalationContact: PropTypes.func,
  handleOpenCreateEscalationContactForm: PropTypes.func,
  hideContactForm: PropTypes.func,
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  getNotificationMethods: PropTypes.func,
  getProfiles: PropTypes.func,
  notificationMethods: PropTypes.array,
  profiles: PropTypes.array,
}

EscalationContactCreationForm.defaultTypes = {
  data: {},
  state: {},
  _createNotification: () => {},
  levelId: null,
  level: {},
  handleCreateEscalationContact: () => {},
  handleOpenCreateEscalationContactForm: () => {},
  hideContactForm: () => {},
  accountSlug: () => {},
  siteSlug: () => {},
  getNotificationMethods: () => {},
  getProfiles: () => {},
  notificationMethods: [],
  profiles: [],
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
  siteSlug: get(state, 'settings.selectedSite'),
  darkMode: get(state, 'settings.darkMode'),
  notificationMethods: get(state, 'threatEscalation.methods'),
  profiles: get(state, 'threatEscalation.profiles'),
})

const mapDispatchToProps = dispatch => ({
  handleCreateEscalationContact: (payload, callback) => {
    dispatch(escalationContactUpdate(payload))
    if (callback) {
      callback()
    }
  },
  getNotificationMethods: () => dispatch(notificationMethodsFetchRequested()),
  getProfiles: payload => dispatch(profilesFetchRequested(payload)),
})

export default compose(
  withTheme,
  connect(mapStateToProps, mapDispatchToProps),
)(EscalationContactCreationForm)
