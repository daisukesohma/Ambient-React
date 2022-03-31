import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { SearchableSelectDropdown } from 'ambient_ui'

const roleToDescription = Object.freeze({
  Member: 'Has access to the video walls.',
  Responder:
    'Has access to the video walls and can respond to dispatch requests.',
  Operator:
    'Has access to the video walls, can receive real-time alerts and can make dispatch requests.',
  Administrator: 'Has administrator access to all features.',
})

const styles = {
  description: {
    margin: '8px 14px 0',
    fontSize: 12,
    fontFamily: '"Aeonik-Regular", "Roboto"',
  },
}

class RoleSelection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleSelection: props.role,
      description: roleToDescription[props.role],
    }

    this.onRoleSelection = this.onRoleSelection.bind(this)
  }

  componentDidMount() {
    if (this.props.role) {
      this.setState({
        description: roleToDescription[this.props.role.label],
      })
    }
  }

  onRoleSelection(e) {
    const description = roleToDescription[e.label]
    this.setState(
      {
        roleSelection: e,
        description,
      },
      () => {
        this.props.onChange(this.state.roleSelection)
      },
    )
  }

  render() {
    const { classes, roleOptions, role } = this.props
    return (
      <div>
        <SearchableSelectDropdown
          onChange={this.onRoleSelection}
          options={roleOptions}
          value={role}
          defaultValue={roleOptions[0]}
          disabled={this.props.disabled}
        />
        <div className={classes.description}>{this.state.description}</div>

        {this.props.children}
      </div>
    )
  }
}

RoleSelection.propTypes = {
  children: PropTypes.object,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  elemId: PropTypes.string,
  elemName: PropTypes.string,
  onChange: PropTypes.func,
  role: PropTypes.string,
  roleOptions: PropTypes.array,
}

RoleSelection.defaultProps = {
  children: undefined,
  classes: '',
  disabled: '',
  elemId: '',
  elemName: '',
  onChange: () => {},
  role: '',
  roleOptions: [],
}

export default withStyles(styles)(RoleSelection)
